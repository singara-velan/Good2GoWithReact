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
  render(){
    var list = [];
    for(var i = 0; i < this.props.todos.length; i++){
      list.push(<li><label>{this.props.todos[i].description}</label><button className="destroy"></button></li>)
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
  }
  addTodo(data){    
    store.dispatch(addAction(data))
  }
    render() {
      return (
        <div className="todo-app">
          <NewTodo onAddTodo={this.addTodo}/>
          <TodoList todos={this.props.todos} />
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
  todos: [{id: 1, description: "Breakfast"}]
};

var addAction = function (data){
  return {
    type: "ADD_TODO",
    data: data
  }
};

var reducer = function(state, action){
  var newState = state;
  switch(action.type){
    case "ADD_TODO":
      return {todos: state.todos.concat({description:action.data})};
      console.log("Added");
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
    onAddTodo: bindActionCreators(addAction, dispatch)
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
