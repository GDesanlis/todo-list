import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TodoDetailComponent} from "./todo-detail/todo-detail.component";
import {TodoService} from "./todo/todo.service";

@Component({
    selector: 'my-app',
    template: `
      <div class="jumbotron">
      <div class="container">
        <h1>{{title}}</h1>
      </div>
      </div>
      <router-outlet></router-outlet>
    `,
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
    title = 'Todo List';
}