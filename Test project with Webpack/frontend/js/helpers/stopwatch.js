import Quiz from '../views/pages/quiz.js';

class Stopwatch {
    constructor(timer) {
        this.timer = timer;
        this.isOn = false;
        this.time = 0;
        this.offset = 0;
        this.interval = 0;
        this.quiz = new Quiz();
    }

    update() {
        if (this.isOn) this.time += this.delta();

        localStorage.getItem('timeIs2min')? this.timer.textContent = '02 : 00 : 000' : this.timer.textContent = this.timerFormatter();
    }

    delta() {
        let now = Date.now(),
            timePassed = now - this.offset;

        this.offset = now;

        return timePassed;
    }

    timerFormatter() {
        if (!localStorage.getItem('End') && document.getElementsByClassName('quiz')[0]){
            this.changeTime = new Date(this.time);
            localStorage.setItem('changeTime', JSON.stringify(this.changeTime));
            let minutes = this.changeTime.getMinutes().toString(),
                seconds = this.changeTime.getSeconds().toString(),
                milliseconds = this.changeTime.getMilliseconds().toString();

            if (minutes.length < 2) minutes = `0${minutes}`;

            if (+minutes >= 2) {
                this.stop();
                localStorage.setItem('timeIs2min','2min');
                this.quiz.renderEnd(this.scoreQuiz);
                return '02 : 00 : 000';
            }

            if (+minutes >= 1 && +seconds >= 45) this.quiz.redStopwatch();
            if (seconds.length < 2) seconds = `0${seconds}`;

            while (milliseconds.length < 3) milliseconds = `0${milliseconds}`;

            return `${minutes} : ${seconds} : ${milliseconds}`;
        } else {
            this.stop().reset();
        }
    }

    start() {
        this.isOn = true;
        this.interval = setInterval(this.update.bind(this), 10);
        this.offset = Date.now();
        this.scoreQuiz = 0;
        localStorage.removeItem('End');
        localStorage.removeItem('timeIs2min');
    }

    stop() {
        clearInterval(this.interval);
        this.isOn = false;
        return this;
    }

    reset() {
        clearInterval(this.interval);
        this.time = 0;
        this.timer.textContent = '00 : 00 : 000';
        return this;
    }

    scoring(quizScore){
        this.scoreQuiz = quizScore;
    }
}

export default Stopwatch;
