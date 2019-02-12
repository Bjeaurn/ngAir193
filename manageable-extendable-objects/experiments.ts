export type TodoId = string & { todoId: 'todoId' }
export interface Todo {
    id: TodoId
    title: string
    isChecked?: boolean
}

const todoExample = {
    id: '',
    title: '',
    isChecked: false
} as Todo

export type NewTodo = Pick<Todo, 'title' | 'isChecked'>

const n: NewTodo = {
    title: '',
    // isChecked is still optional
}

export type EditTodo = Pick<Todo, 'id' | 'title' | 'isChecked'> & { isChecked: boolean }
const eFault: EditTodo = {
    id: '' as TodoId,
    title: '', 
    //  isChecked is no longer optional!
}

const eCorrect: EditTodo = {
    id: '' as TodoId,
    title: '',
    isChecked: false
}

const eCorrect2: EditTodo = {
    id: todoExample.id,
    title: 'new title',
    isChecked: todoExample.isChecked || false
}

export class TodoService {
    // Something you can do now!
    createTodo(todo: NewTodo) {
        todo // Great type completion
    }
    updateTodo(todo: EditTodo) {}

    // Alternatively you could
    create(todo: Todo) {
        const newTodo: NewTodo = {
            title: todo.title,
            isChecked: todo.isChecked
        }
        // Now handle this, keeps the creation logic close to where it's needed. 
        // But this depends on your architecture and situation.
    }
}
