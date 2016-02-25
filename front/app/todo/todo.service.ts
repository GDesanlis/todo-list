import {Injectable}     from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Todo}           from './todo';
import {Observable}     from 'rxjs/Observable';
import {Headers, RequestOptions} from 'angular2/http';

@Injectable()
export class TodoService {
    constructor(private _http:Http) {
    }

    private _tasksUrl = 'http://127.0.0.1:4000/api/v1/tasks';

    getTodos():Observable<Todo[]> {
        return this._http.get(this._tasksUrl)
            .map(res => {
                if (res.status === 200)
                    return <string[]> res.json();
                else
                    return <string[]>[];
            })
            .flatMap(links => Observable.forkJoin(links.map((link) => this.getTodo(link))))
            .catch(this._handleError);
    }

    getTodo(url:string):Observable<Todo> {
        return this._http.get(url)
            .map(res => <Todo> res.json())
            .catch(this._handleError);
    }

    getTodoById(id:string):Observable<Todo> {
        let url = this._tasksUrl + '/' + id;
        return this._http.get(url)
            .map(res => <Todo> res.json())
            .catch(this._handleError);
    }

    addTodo(content:string):Observable<Todo> {

        const body = JSON.stringify({content});
        const headers = new Headers({'Content-Type': 'application/json'});
        const options = new RequestOptions({headers: headers});

        return this._http.post(this._tasksUrl, body, options)
            .map(res => <Todo> res.json())
            .catch(this._handleError)
    }

    removeTodo(id:string) {
        let url = this._tasksUrl + '/' + id;
        return this._http.delete(url).catch(this._handleError);
    }

    updateTodo(todo:Todo){
        let url = this._tasksUrl + '/' + todo.id;

        const body = '{' +
            '"content":' + JSON.stringify(todo.content)
            + ',"status":' + JSON.stringify(todo.status)
            + '}';
        const headers = new Headers({'Content-Type': 'application/json'});
        const options = new RequestOptions({headers: headers});

        return this._http.put(url, body, options)
            .map(res => <Todo> res.json())
            .catch(this._handleError)
    }
    private _handleError(error:Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.text() || 'Server error');
    }
}
