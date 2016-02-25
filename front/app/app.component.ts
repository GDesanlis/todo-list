import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TodoDetailComponent} from "./todo-detail/todo-detail.component";
import {TodoService} from "./todo/todo.service";

@Component({
    selector: 'my-app',
    template: `
      <h1>{{title}}</h1>
      <router-outlet></router-outlet>
    `,
    styleUrls: ['app/app.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS,
        TodoService
    ]
})
@RouteConfig([
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardComponent,
        useAsDefault: true
    },
    {
        path: '/detail/:id',
        name: 'TodoDetail',
        component: TodoDetailComponent
    }
])
export class AppComponent {
    title = 'Todo list';
}