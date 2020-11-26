import { AuthContext, LoadingContext } from '../../Contexts';
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createPost } from '../../WebAPI';
import { ErrorMessage } from '../../utils';


export default function Newpost() {
    const history = useHistory();

    const { userData } = useContext(AuthContext);
    const { setLoading, loading } = useContext(LoadingContext)
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [errMessage, setErrMessage] = useState("");

    useEffect(() => {
        if(!userData) {
            history.push('/')
        }
    }, [userData])
    // 防止未登入使用者透過 url 進入 newpost
    // 這邊應該是不用把 history 加入 dependency？可是如果 userData 有改變就需要再 check 一次 useEffect

    

    const handleSubmit = (e) => {
        setErrMessage('')
        if (loading) return 
        e.preventDefault();
        setLoading(true);
        createPost(title, content).then(res => {
            console.log(res);
            if (res.ok === 0) {
                setErrMessage(res.message);
                setLoading(false);
                return 
            }
            history.push('/')
        });
    }

    return (<form>
        <div>Title: {' '}
            <input value={title} onChange={(e) => {setTitle(e.target.value)}}></input>
        </div>
        <div>Content：{' '}
            <textarea value={content} onChange={(e) => {setContent(e.target.value)}}></textarea>
        </div>
        <button onClick={handleSubmit} >submit</button>
        <ErrorMessage>{errMessage}</ErrorMessage>

    </form>)
}