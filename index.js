
function App () {
    // const para o display do tempo
    const [displayTime,setDisplayTime] = React.useState(25*60);
    // const para o break time que aparece na tela
    const [breackTime, setBreakTime] = React.useState(5*60)
    // const para o session time do display
    const [sessionTime, setSessionTime] = React.useState(25*60)
    // const para saber se o timer esta ativado
    const [timerOn, setTimerOn] = React.useState(false)
    // o OnBreak é para a alternancia do relogio entre o break e session
    const [onBreak, setOnBreak] = React.useState(false)
    // Audio a ser tocado
    // const [breakAudio, setBreakAudio] = React.useState(
    //     new Audio("https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav")
    // );
    
    // const playBreakAudio = () => {
    //     // breakAudio.currentTime = 0;
    //     // breakAudio.play()
    //     document.getElementById('beep').play()
    // }


    const formatTime = (time) => {
        let minutes = Math.floor(time/60);
        let seconds = time%60;

        return (
            (minutes < 10 ? "0" + minutes : minutes) +
            ":" +
            (seconds < 10 ? "0" + seconds : seconds)
        )
    }

    const formatTimeOnlyMinute = (time) => {
        let minutes = Math.floor(time/60);
        return minutes
    }

    const changeTime = (amount, type) => {
        if (type==="break") {
            if (breackTime<=60&&amount<0||breackTime>(60*60-1)) {
                return;
            }
            setBreakTime((prev)=> prev + amount)
        } else {
            if (sessionTime<=60&&amount<0||sessionTime>(60*60-1)) {
                return;
            }
            setSessionTime((prev) => prev + amount)
            if (!timerOn) {
            setDisplayTime(sessionTime+amount)
            }
        }
    }

    const controlTime = () => {
        // 1000 representa 1000 milisegundos, que é 1s
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreackVariable = onBreak
        if(!timerOn) {
            let interval = setInterval(() => {
                date = new Date().getTime();
                if (date>nextDate) {
                    setDisplayTime((prev) => {
                        if (prev<=0&& !onBreackVariable) {
                            document.getElementById('beep').play();
                            onBreackVariable = true;
                            setOnBreak(true)
                            return breackTime
                        } else if (prev<=0 && onBreackVariable){
                            document.getElementById('beep').play();
                            onBreackVariable = false;
                            setOnBreak(false)
                            return sessionTime
                        }
                        return prev-1
                    });
                    nextDate +=second;
                }
            }, 100);
            localStorage.clear();
            localStorage.setItem("interval-id", interval)
        } 
        if (timerOn) {
            clearInterval(localStorage.getItem("interval-id"))
        }
        setTimerOn(!timerOn)
    }

    const resetTime = () => {
        clearInterval(localStorage.getItem("interval-id"))
        setDisplayTime(25*60)
        setSessionTime(25*60)
        setBreakTime(5*60)
        setTimerOn(false)
        document.getElementById('beep').pause()
        document.getElementById('beep').currentTime = 0;
    }


    return (
        <div className="center-align">
            <h1>Pomodoro Clock</h1>
            <div className="dual-container">
                <Break 
                    title={"Break Length"}
                    changeTime={changeTime}
                    type={"break"}
                    time={breackTime}
                    formatTime={formatTimeOnlyMinute}
                />
                <Session 
                    title={"Session Length"}
                    changeTime={changeTime}
                    type={"session"}
                    time={sessionTime}
                    formatTime={formatTimeOnlyMinute}
                />
            </div>
            <div>
                <h3 className="session" id="timer-label">{onBreak? "Break Time" : "Session Time"}</h3>
                <h1 id="time-left">{formatTime(displayTime)}</h1>
            </div>
            <button id="start_stop" className="btn-small lighten-2 func" onClick={controlTime}>
                {timerOn ? (<i class="fas fa-pause"></i>) : 
                (<i class="fas fa-play"></i>)}
            </button>
            <button id="reset" className="btn-small lighten-2 func" onClick={resetTime}>
                <i class="fas fa-undo-alt"></i>
            </button>
            <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"> </audio>
        </div>
    )
}


function Break ({title, changeTime, type, time, formatTime}) {
    return (
        <div id="break-label">
            <h3>{title}</h3>
            <div className="time-sets">
                <button id="break-decrement"
                onClick={() => changeTime(-60,type)}
                className="btn-small lighten-2">
                    <i className="fas fa-arrow-down"></i>
                </button>
                <h4 id="break-length">{formatTime(time)}</h4>
                <button id="break-increment"
                onClick={() => changeTime(+60,type)}
                className="btn-small lighten-2">
                    <i class="fas fa-arrow-up"></i>
                </button>
            </div>
        </div>
    )
}

function Session ({title, changeTime, type, time, formatTime}) {
    return (
        <div id="session-label">
            <h3>{title}</h3>
            <div className="time-sets">
                <button id="session-decrement"
                onClick={() => changeTime(-60,type)}
                className="btn-small lighten-2">
                    <i class="fas fa-arrow-down"></i>
                </button>
                <h4 id="session-length">{formatTime(time)}</h4>
                <button id="session-increment"
                onClick={() => changeTime(+60,type)}
                className="btn-small lighten-2">
                    <i class="fas fa-arrow-up"></i>
                </button>
            </div>
        </div>
    )
    }

ReactDOM.render(<App />, document.getElementById("root"));