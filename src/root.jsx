class NewTodo extends React.Component{
  constructor(){
    super();
    this.addTodo = this.addTodo.bind(this);
  }
  addTodo(e){
    e.preventDefault();
    this.props.onAddTodo(this.refs.newTodo.value);
    this.refs.newTodo.value = "";
  }
  render(){
    return(
      <form onSubmit={this.addTodo}>
        <input type="text" ref="newTodo" className="todo-new" placeholder="Type and enter to add new Todo..."/>
      </form>
    )
  }
}

class TodoList extends React.Component{
  constructor(){
    super();
    this.completeTodo = this.completeTodo.bind(this);
    this.removeTodo = this.removeTodo.bind(this);
  }
  completeTodo(index){
    this.props.onCompleteTodo(index);
  }
  removeTodo(index){
    this.props.onRemoveTodo(index);
  }
  render(){
    var list = [];
    for(var i = 0; i < this.props.todos.length; i++){
      var className = this.props.todos[i].status == "COMPLETED" ? "completed" : "";
      list.push(<li className = {className}>
        <input type="checkbox" checked={className == "completed" ? 'checked': ''} className="markAsDone" onClick={this.completeTodo.bind(null, i)}></input>
        <label>{this.props.todos[i].description}</label>
        <button className="destroy" onClick={this.removeTodo.bind(null, i)}></button></li>)
    }

    return (
    <section className="todo-list-container">
      <ul className="todo-list">
        {list}
      </ul>
    </section>
  )
  }
}

class TodoFooter extends React.Component {
  render(){
    return(
      <section className="footer">
      <div className="clearfix">
        <span className="todo-count">{this.props.todos.length} item</span>
        </div>
      </section>
    )
  }
}

class App extends React.Component {
  constructor(props, context){
    super(props, context);
    this.addTodo = this.addTodo.bind(this);
    this.completeTodo = this.completeTodo.bind(this);
    this.removeTodo = this.removeTodo.bind(this);
  }
  addTodo(data){
    store.dispatch(addAction(data))
  }
  completeTodo(index){
    store.dispatch(completedAction(index))
  }
  removeTodo(index){
    store.dispatch(removeAction(index))
  }
    render() {
      return (
        <div className="todo-app">
          <NewTodo onAddTodo={this.addTodo}/>
          <TodoList todos={this.props.todos} onCompleteTodo={this.completeTodo} onRemoveTodo = {this.removeTodo} />
          <TodoFooter todos={this.props.todos} />
        </div>
      )
    }
}

var createStore = Redux.createStore;
var bindActionCreators = Redux.bindActionCreators;
var Provider = ReactRedux.Provider;
var connect = ReactRedux.connect;
var dispatch = ReactRedux.dispatch;

var initialState = {
  todos: [{id: 1, description: "Breakfast", status: "PENDING"}]
};

var addAction = function (data){
  return {
    type: "ADD_TODO",
    data: data
  }
};

var completedAction = function(index){
  return {
    type: "COMPLETED",
    data: index
  }
};

var removeAction =  function(index){
  return {
    type: "REMOVED",
    data: index
  }
}

var reducer = function(state, action){
  var newState = state;
  switch(action.type){
    case "ADD_TODO":
     var newState = {
       todos: [
       ...state.todos,
       {
         id: state.todos.length + 1,
         description: action.data,
         status: "PENDING"
       }]
     };
      return newState;
    case "COMPLETED":
      var newState = {
        todos: [
          ...state.todos.slice(0, action.data),
          {
            id:state.todos[action.data].id,
            description:state.todos[action.data].description,
            status: state.todos[action.data].status == "COMPLETED" ? "PENDING" : "COMPLETED"
          },
          ...state.todos.slice(action.data+1)
        ]
      }
      return newState;

    case "REMOVED":
      var newState = {
        todos: [
          ...state.todos.slice(0, action.data),
          ...state.todos.slice(action.data+1)
        ]
      };
      return newState;
  }
  return newState;
}

var store = createStore(reducer, initialState);

function mapStateToProps(state) {
  return {
    todos: state.todos
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAddTodo: bindActionCreators(addAction, dispatch),
    onComplete: bindActionCreators(completedAction, dispatch),
    onRemove: bindActionCreators(removeAction, dispatch)
  };
}


const Smartcomponent =  connect(
      mapStateToProps,
      mapDispatchToProps
    )(App)

ReactDOM.render(
  <Provider store={store}>
    <Smartcomponent />
  </Provider>
,
  document.getElementById("root"));
