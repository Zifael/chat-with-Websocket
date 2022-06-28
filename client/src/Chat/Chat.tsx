import React, { useEffect, useRef, useState } from 'react';
import s from './Chat.module.css';
import submitImg from '../Img/submitImg.png'
import axios from 'axios';

interface userMessages {
    event: any;
    id: number,
    name: string,
    message: string,
    date: number[]
}



function Chat() {
    const [value, setValue] = useState('')
    const [name, setName] = useState('')
    const [userMessages, setUserMessages] = useState<Array<userMessages>>([])
    const socket = useRef<any>()
    const [connected, setConnected] = useState(false)

    const form = (e: any) => {
        e.preventDefault();            
        connection()       
    }
    
    const connection = () => {
        socket.current = new WebSocket('ws://localhost:4000')
        socket.current.onopen = () => {
            console.log('Сервер открылся')
            setConnected(true)
            const message = {
                event: 'connection',
                name,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }        
        socket.current.onmessage = (event: any) => {            
            const message = JSON.parse(event.data)
            setUserMessages(prev => [...prev, message])            

        }
        socket.current.onclose = () => {
            console.log('Сервер закрылся')
        } 
        socket.current.onerror = () => {
            console.log('Произошла ошибка')
        }
    }
    
    const sendMessage = async() => {
        const message = {
            event: 'message',
            id: Date.now(),
            name,
            message: value,
            date: [11,14]
        }
        socket.current.send(JSON.stringify(message))
        setValue('')
    }

    const removeMessage = (id: number) => {
        setUserMessages(prev => prev.filter(m => m.id !== id))
    }   

     
    if(!connected) {
        return (
            <div className={s.center}>
                <form onSubmit={(e) => form(e)} className={s.form}>
                    <div className={s.titelForm}>Введите логин</div>
                    <input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className={s.inputForm} 
                    />                    
                </form>
            </div>
        )
    }

    return (
        <div className={s.longPolling}>
            <div className={s.head}></div>
            <div className={s.main}>
                {userMessages.map(m => 
                    <div className={s.blockMesssagesUsers} key={m.id}>
                        <div>{m.name}</div>
                        <div className={s.contentUser}>
                            {m.event === 'connection' 
                                ? <div className={s.message}>подключился</div>
                                :<div  className={s.contentUsers}>
                                    <div className={s.contentUserMessages}>
                                        <div className={s.message}>{m.message}</div>
                                        <div className={s.date}>{`${m.date[0]}:${m.date[1]}`}</div>
                                    </div>
                                    <div onClick={() => removeMessage(m.id) } className={s.close}>&#10006;</div>
                                </div>
                            }                            
                        </div>
                    </div>
                )}
            </div>
            <div>
                <div className={s.blockInputButton}>
                    <input value={value} onChange={(e) => setValue(e.target.value)} className={s.input} />
                    <img onClick={() => sendMessage()} className={s.submit} src={submitImg} />
                </div>
            </div>
        </div>
    );
}

export default Chat;