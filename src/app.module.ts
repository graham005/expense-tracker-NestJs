import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ReportsModule } from './reports/reports.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeedModule } from './seed/seed.module';
import { LoggerMiddleware } from './logger.middleware';
import { LogsModule } from './loggers/logs.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    UsersModule, CategoriesModule, ExpensesModule, ReportsModule, DatabaseModule, SeedModule, LogsModule,
  CacheModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    isGlobal: true,
    useFactory: (configService: ConfigService) => {
      return {
        ttl: 60000,
        stores: [
          new Keyv({
            store: new CacheableMemory({ ttl: 30000, lruSize: 5000}),
          }),
          createKeyv(configService.getOrThrow<string>('REDIS_URL')),
        ],
      };
    },
  }),
  CacheableMemory
],
  controllers: [AppController],
  providers: [AppService, {
    provide: 'APP_INTERCEPTOR',
    useClass: CacheInterceptor
  }],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users', 'categories', 'expenses', 'reports')
  }
}
