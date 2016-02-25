import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';
import {Todo} from "../todo/todo";
import {TodoService} from "../todo/todo.service";
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'my-dashboard',
    templateUrl: 'app/dashboard/dashboard.component.html',
    styleUrls: ['app/dashboard/dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
    errorMessage: string;
    todos:Todo[] = [];

    constructor(
        private _router: Router,
        private _todoService:TodoService) {
    }

    ngOnInit() {
        this.getTodos();
    }

    getTodos() {
        this._todoService.getTodos()
            .subscribe(
                todos => this.todos = todos,
                error =>  this.errorMessage = <any>error);
    }

    gotoDetail(todo:Todo) {
        let link = ['TodoDetail', {id: todo.id}];
        this._router.navigate(link);
    }

    newTask(){
        let newTodo: Todo;
        this._todoService.addTodo('New Task')
            .subscribe(
                todo => {
                    newTodo = todo;
                    let link = ['TodoDetail', {id: newTodo.id}];
                    this._router.navigate(link);},
                error =>  this.errorMessage = <any>error);
    }

    remove(todo:Todo){
        this._todoService.removeTodo(todo.id)
            .subscribe(
                () => {
                    //this._router.navigate(['Dashboard']);
                    for (i =0 ; i < this.todos.length ; i++)
                        if (this.todos[i].id == todo.id){
                            this.todos.splice(i,1);
                            break;
                        }

                    },
                error =>  this.errorMessage = <any>error);
    }
}