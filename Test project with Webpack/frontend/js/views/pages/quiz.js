import Component from '../component';

import Stopwatch from '../../helpers/stopwatch';

import QuestionsTemplate from '../../../templates/pages/question.hbs';

import ShowSaveResult from '../../../templates/pages/save-result.hbs';

class Quiz extends Component {
    constructor() {
        super();

        this.count = JSON.parse(localStorage.getItem('count')) || 0;
        this.score = JSON.parse(localStorage.getItem('score')) || 0;
        this.correctAnswer = false;
        this.prevFlag = JSON.parse(localStorage.getItem('prevFlag')) || false;
        this.results = JSON.parse(localStorage.getItem('results')) || [];
    }

    render() {
        return new Promise(resolve => {

            fetch('http://localhost:3000/api/questions')
                .then(response => response.json())
                .then(questions => {
                        this.questions = questions;

                        resolve(QuestionsTemplate({}));
                })
                .catch(e => alert(`Упс, что пошло не так, ошибка: ${e}`));
        });
    }

    afterRender() {
        this.renderQuestion();
        this.startStopwatch();
        this.setActions();
    }

    setActions() {
        const choicesParagraph = document.getElementsByTagName('p')[2],
            resetButton = document.getElementsByClassName('reset')[0],
            prevButton = document.getElementsByClassName('prev')[0];

        prevButton.addEventListener('click', () => this.prevQuestion());
        resetButton.addEventListener('click', () => this.resetQuiz());
        choicesParagraph.addEventListener('click', event => {

            const target = event.target;

            if (target.classList.contains('selection')) {
                this.scoring(target);
            }
        });
    }

    renderQuestion() {
        return new Promise(() => {
            const prevButton = document.getElementsByClassName('prev')[0],
            question = document.getElementsByTagName('h2')[0],
            // choicesParagraph = document.getElementsByTagName('p')[2],
            selections = document.querySelectorAll('.selection');

        // На первой странице кнопка prev скрыта, на след зависит от флага prevFlag
        if (!this.prevFlag) {
            prevButton.classList.add('hide');
        } else {
            prevButton.classList.remove('hide');
        }

        // Вставляем варианты ответов
        selections.forEach((selection, i) => selection.textContent = this.questions[this.count].choices[i]);

        // Вставляем вопрос
        question.textContent = this.questions[this.count].question;

        this.updateProgress();
        });
    }

    scoring(checkedAnswer) {

        // Сохраним истинно верный ответ в переменную
        let answer = this.questions[this.count].answer;
        // Кнопка prev видна когда выбран ответ и отрисован след вопрос
        this.prevFlag = true;
        localStorage.setItem('prevFlag',JSON.stringify(this.prevFlag));

        // Проверка на правильность ответа
        if (checkedAnswer.textContent === this.questions[this.count].choices[answer]) {
            this.correctAnswer = true;
            this.score++;
            localStorage.setItem('score', JSON.stringify(this.score));
            checkedAnswer.style.boxShadow = '10px 5px 5px green';
        } else {
            this.correctAnswer = false;
            checkedAnswer.style.boxShadow = '10px 5px 5px red';
        }

        // Следующий вопрос с задержкой, чтобы показать верный/неверный ответ был дан
        setTimeout(() => this.nextQuestion(checkedAnswer), 500);

        this.stopwatch.scoring(this.score);
    }

    nextQuestion(prevAnswer) {
        prevAnswer.style.boxShadow = '';
        // Начинаем отсчет вопросов
        this.count++;
        localStorage.setItem('count', JSON.stringify(this.count));

        if (this.count > 20) {
            this.count = 20;
        } else if (this.count !== 20) {
            // Т.к. вопросов 20, все которые до - можем отрисовывать
            this.renderQuestion().then();
        } else if (this.count === 20) {
            // Т.к. вопрос последний выводим результаты и останавливаем таймер
            this.renderEnd();
            this.stopwatch.stop();
        }
    }

    prevQuestion() {

        // Флаг в false, т.к. можно вернуться только на один вопрос назад
        this.prevFlag = false;
        localStorage.setItem('prevFlag',JSON.stringify(this.prevFlag));

        // Если ответ верный - снять один бал из общего результата
        if (this.correctAnswer) {
            this.correctAnswer = false;
            this.score--;
            localStorage.setItem('score', JSON.stringify(this.score));
        }

        // Счетчик на один обратно так как предыдущий вопрос
        this.count--;
        localStorage.setItem('count', JSON.stringify(this.count));

        this.renderQuestion();
    }

    resetQuiz() {

        // Обнуляем счетчики и флаги
        this.count = 0;
        this.score = 0;
        localStorage.setItem('score', JSON.stringify(this.score));
        localStorage.setItem('count', JSON.stringify(this.count));
        this.correctAnswer = false;
        this.prevFlag = false;
        localStorage.setItem('prevFlag',JSON.stringify(this.prevFlag));

        // Убираем результат, мотивационное сообщение и удаляем тег audio
        const result = document.getElementsByTagName('p')[0],
            motivation = document.getElementsByTagName('p')[1],
            saveResult = document.getElementsByClassName('show-save-result')[0];

        result.textContent = '';
        motivation.textContent = '';
        saveResult.remove();

        // Возвращаем белый цвет таймеру
        const timer = document.getElementById('timer');
        timer.style.color = 'white';

        // Снова показываем вопросы и скрываем кнопку reset
        const choicesParagraph = document.getElementsByTagName('p')[2],
            resetButton = document.getElementsByClassName('reset')[0];

        choicesParagraph.classList.remove('hide');
        resetButton.classList.add('hide');

        this.renderQuestion();
        this.stopwatch.reset().start();
    }

    updateProgress(toZeroProgress) {

        // Обнуляем счетчик номер вопроса(когда вызываем из renderEnd)
        if (toZeroProgress) this.count = 0;

        // Обновление прогресс-бара согласно номеру вопроса
        let progressPercentage = Math.round((this.count / 20) * 100);
        const progress = document.getElementsByClassName('progress-bar')[0];

        progress.style.width = `${progressPercentage}%`;
    }

    renderEnd(scoring) {

        if (scoring) {
            this.score = scoring;
        }
        let score = Math.round(this.score / 20 * 100);

        const choicesParagraph = document.getElementsByTagName('p')[2],
            resetButton = document.getElementsByClassName('reset')[0],
            prevButton = document.getElementsByClassName('prev')[0],
            question = document.getElementsByTagName('h2')[0],
            result = document.getElementsByTagName('p')[0],
            motivation = document.getElementsByTagName('p')[1],
            toZeroProgress = true,
            audio = document.getElementById('player'),
            motivationVariants = [{
                bad: 'Hmm, I think you can do better. Try again',
                sound: '../../../sounds/tom-i-dzheri-zvuk-neudachi.ogg'
            },{
                good: 'Not bad, but I still think you can do better. Don\'t give up'
            },{
                nice: 'Congratulations, you are pretty smart',
                sound: '../../../sounds/mario-zvuk-pobedy.ogg'
            },{
                awesome: 'Congratulations, you are perfect'
            }];

        // Вставка "спасибо" и вывод результата
        question.textContent = 'Thank you for Completing the Test!';
        result.textContent = `Your score is: ${score}%`;

        // Вставка мотивационного сообщения и проигрыш мелодии(в зависимости от результата)
        if (score <= 30) {
            motivation.textContent = motivationVariants[0].bad;
            audio.src = motivationVariants[0].sound;
            audio.play();
        } else if (score <= 55) {
            motivation.textContent = motivationVariants[1].good;
            audio.src = motivationVariants[0].sound;
            audio.play();
        } else if (score <= 95) {
            motivation.textContent = motivationVariants[2].nice;
            audio.src = motivationVariants[2].sound;
            audio.play();
        } else if (score > 95) {
            motivation.textContent = motivationVariants[3].awesome;
            audio.src = motivationVariants[2].sound;
            audio.play();
        }

        // Скрываем абзац с вопросами и кнопкой prev, показываем кнопку reset
        choicesParagraph.classList.add('hide');
        prevButton.classList.add('hide');
        resetButton.classList.remove('hide');

        localStorage.removeItem('score');
        localStorage.removeItem('count');
        localStorage.setItem('prevFlag','false');
        localStorage.setItem('End', 'end');

        // Сбрасываем прогресс-бар в ноль
        this.updateProgress(toZeroProgress);

        // Показываем блок с возможностью сохранить реультат
        this.showSaveResult()
            .then(html => {
            choicesParagraph.insertAdjacentHTML('afterEnd', `${html}`);
            return this;
            })
            .then(() => this.saveResult(score));
    }

    startStopwatch() {

        const timer = document.getElementById('timer');

        this.stopwatch = new Stopwatch(timer);

        this.stopwatch.start();
    }

    redStopwatch() {
        // Делаем таймер красным(сигнал о скором завершении времени)
        const timer = document.getElementById('timer');

        timer.style.color = 'red';
    }

    showSaveResult() {
        // Вставляем инпут для сохранения результата
        return new Promise(resolve => resolve(ShowSaveResult({})));
    }

    saveResult(score) {

        const inputName = document.getElementsByTagName('input')[0],
              saveResultButton = document.getElementsByTagName('input')[1],
              saveResult = document.getElementsByClassName('show-save-result')[0];

        saveResultButton.addEventListener('click', () => {
            if (inputName.value !== '' && inputName.value !== ' ' ) {
                const result = {[`${inputName.value.trim()}`]: score};
                this.results.unshift(result);
                if (this.results.length > 5) this.results.length = 5;
                this.results.sort((a,b) => Object.values(b) - Object.values(a));

                localStorage.setItem('results', JSON.stringify(this.results));

                this.showResults(saveResult,this.results);
            } else {
                alert('Введите корректное значение в поле Name');
                inputName.value = '';
            }

        });
    }

    showResults(saveResult, results) {
        saveResult.innerHTML = results.map((result,i) => {
           return `<p>${i+1}. ${Object.keys(result)} - ${Object.values(result)}%</p>`;
        }).join('\n') ;
    }
}

export default Quiz;