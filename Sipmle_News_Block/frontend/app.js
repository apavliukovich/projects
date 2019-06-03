const my_news = [
    {
        author: 'Саша Печкин',
        text: 'В четверг, четвертого числа',
        bigText: 'лигурийский регулировщик не справился со своими прямыми обязанностями'
    },
    {
        author: 'Вася Пивоваров',
        text: 'Я думаю, что доллары должны давать бесплатно',
        bigText: 'жаль, что я один так думаю.'
    },
    {
        author: 'Гость',
        text: 'Бесплатно.Скачать. Лучший сайт - http://localhost:3000',
        bigText: 'На самом деле платно. Да и сайт не самый лучший. Но последнее слово за вами.'
    }
];

window.ee = new EventEmitter();

const Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired
        })
    },
    getInitialState () {
        return {
            visible: false
        };
    },
    readMoreClick (evt) {
        evt.preventDefault();

        this.setState({visible:true});
    },
   render () {
       let author = this.props.data.author,
           text = this.props.data.text,
           bigText = this.props.data.bigText,
           visible = this.state.visible; //считываем состояние переменной из состояния компонента

       return (
           <div className='article'>
               <p className='news__author'>{author}:</p>
               <p className='news__text'>{text}</p>
               <a href='#'
                  onClick={this.readMoreClick}
                  className={`news__readmore ${visible ? 'none' : ''}`}>
                  Подробнее
               </a>
               <p className={`news__big-text ${visible ? '' : 'none'}`}>{bigText}</p>
           </div>
       )
   }
});

const News = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },

    render () {
        let data = this.props.data,
            newsTemplate;

        if(data.length > 0){
           newsTemplate = data.map((item,i) => {
                return (
                    <div key={i}>
                        <Article data={item} />{/*Добавили свойство data*/}
                    </div>
                )
            });
        } else {
            newsTemplate = <p>К сожалению новостей нет</p>
        }

        return (
            <div className='news'>
                {newsTemplate}
                <strong
                    className={`news__count ${data.length > 0 ? '' : 'none'}`}>
                    Всего новостей - {data.length}
                </strong>
            </div>
        );
    }
});
const Add = React.createClass({
    getInitialState () {
        return {
            agreeNotChecked: true,
            authorIsEmpty: true,
            textIsEmpty: true
        }
    },
    componentDidMount () {
        ReactDOM.findDOMNode(this.refs.author).focus();
    },
    onCheckRuleClick () {
        this.setState({agreeNotChecked: !this.state.agreeNotChecked})
    },

    onBtnClickHandler (evt) {
        evt.preventDefault();
        let author = ReactDOM.findDOMNode(this.refs.author).value,
            text = ReactDOM.findDOMNode(this.refs.text).value,
            textArr = text.split(' ');

        const item = [{
            author: author,
            text: textArr.length > 8 ? textArr.slice(0,8).join(' ') : textArr.join(' '),
            bigText: textArr.length > 8 ? textArr.slice(8).join(' ') : '...'
        }];

        window.ee.emit('News.add', item) ;

        text = '';
        this.setState({textIsEmpty: true})
    },
    onFieldChange (fieldName, evt) {
        evt.target.value.trim().length > 0 ? this.setState({[fieldName]: false}) : this.setState({[fieldName]: true})
    },

    render () {
        return (
            <form className='add cf'>
                <input
                    type='text'
                    className='add__author'
                    onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
                    placeholder='Ваше имя'
                    ref='author'/>
                <textarea
                    className='add__text'
                    onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
                    placeholder='Текст новости'
                    ref='text'>
                </textarea>
                <label className='add__checkRule'>
                    <input
                        type="checkbox"
                        onChange={this.onCheckRuleClick}
                        ref='checkRule'/>Я согласен с правилами
                </label>
                <button
                    className='add__btn'
                    disabled={this.state.agreeNotChecked || this.state.authorIsEmpty || this.state.textIsEmpty}
                    onClick={this.onBtnClickHandler}
                    ref='alert_button'>
                    Добавить новость
                </button>
            </form>
        )
    }
});

const App = React.createClass({
    getInitialState () {
        return {
            news: my_news
        }
    },
    componentDidMount () {
        window.ee.addListener('News.add', (item) => {
            let nextNews = item.concat(this.state.news);
            this.setState({news:nextNews})
        })
    },
    componentWillUnmount () {
        window.ee.removeListener('News.add');
    },
    render () {
        console.log('render');
        return (
            <div className='app'>
                <h2>Новости</h2>
                <Add />
                <News data={this.state.news} />{/*Добавили свойство data*/}
            </div>
        );
    }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);