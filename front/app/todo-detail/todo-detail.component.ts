import { Component, OnInit, Inject } from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';
import {Todo} from "../todo/todo";
import {TodoService} from "../todo/todo.service";

@Component({
    selector: 'my-todo-detail',
    templateUrl: 'app/todo-detail/todo-detail.component.html',
    styleUrls: ['app/todo-detail/todo-detail.component.css']
})
export class TodoDetailComponent implements OnInit {
    public todo:Todo;
    public status = ['Aucun', 'A faire', 'En cours', 'Terminée'];
    id:string;
    errorMessage:string;

    constructor(private _todoService:TodoService,
                private _router: Router,
                private _routeParams:RouteParams) {
        this.id = _routeParams.get('id');
    }

    ngOnInit() {
        // let id = + this._routeParams.get('id');
        this.getTodo('' + this.id);
    }

    getTodo(id:string) {
        this._todoService.getTodoById(id)
            .subscribe(
                todo => { this.todo = todo; },
                error => this.errorMessage = <any>error);
    }

    goBack() {
        window.history.back();
    }

    save(todo:Todo) {
        this._todoService.updateTodo(todo)
            .subscribe(
                todo => this._router.navigate(['Dashboard']),
                error => this.errorMessage = <any>error);
    }
}
