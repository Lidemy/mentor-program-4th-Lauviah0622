import styled from "styled-components";

import { useState } from "react";

const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const StyledForm = styled.form`
  margin-top: 55px;
`;

const Title = styled.h3`
  margin: 0;
  padding: 0;
  font-weight: 600;
  &::after {
    content: "*";
    color: red;
    position: relative;
    top: -3px;
    display: none;
    ${(props) => props.required && "display: inline;"}
  }
`;

const Remark = styled.h5`
  margin: 0;
  font-size: 14px;
  margin-top: 12px;
`;

const ErrMsg = styled.p`
  padding-top: 5px;
  margin: 0;
  color: red;
`;

const Answer = styled.div`
  padding-top: 22px;
`;

// styledComponent 有一點覺的有點麻煩，不知道說自定義的 component 能不能用匿名函式？不然都需要在建立一個 component 再用 styled 裝飾
const NudeQustion = ({
  className,
  title,
  remark,
  errMessage,
  required,
  children,
  isValid,
  isEmpty,
}) => {
  return (
    <div className={className}>
      <Title required={required}>{title}</Title>
      {remark && <Remark>{remark}</Remark>}
      <Answer>{children}</Answer>
      {errMessage && !isValid && !isEmpty && <ErrMsg>{errMessage}</ErrMsg>}
    </div>
  );
};

const Question = styled(NudeQustion)`
  margin-bottom: 49px;
`;

const Submit = styled.input`
  padding: 13px 31px;
  border: 0px solid #000;
  border-radius: 5px;
  font-size: 15px;
  background-color: var(--primary-color);
`;

/*
自己在這邊想超久要如何才可以做到
1. Question （指的是問題的 title, 錯誤訊息等等非 input 的東西）保持固定的格式，但 input 保持彈性 => 所以會選擇把 input 放 Question
2. 用簡單（希望是一個參數）的方式串上 state 相關的屬性，因為每個 input 都會需要掛上 value, onchange 
想說能不能一次掛上去？想了很多方法似乎都不太OK，沒辦法用 function 的方法直接幫 input 加上屬性

希望寫的東可能會像這樣？
function Formize = (quetion, input, stateName) {...}
然後就能直接產出需要的整個 Qeustion 和 input
*/

const formDefaultValue = {
  nickname: { value: "", isValid: false },
  email: { value: "", isValid: false },
  phone: { value: "", isValid: false },
  type: { value: "", isValid: false },
  howToKnow: { value: "", isValid: false },
  other: { value: "", isValid: true },
};

export default function Form(params) {
  const [questionsState, setQuestionState] = useState(formDefaultValue);

  const { nickname, email, phone, type, howToKnow, other } = questionsState;

  const checkQuestionState = (e, inputPattern = /.*/g) => {
    const name = e.target.getAttribute("name");
    const value = e.target.value;
    const isValid = value.match(inputPattern);
    setQuestionState({ ...questionsState, [name]: { value, isValid } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let res = Object.entries(questionsState).map(
      ([name, state]) => `${name}: ${state.value}`
    );
    alert(res.join("\n"));
    setQuestionState(formDefaultValue);
  };

  const isFinish =
    Object.values(questionsState).filter(({ isValid, value }) => !isValid)
      .length < 1;
  const isEmptyForm =
    Object.values(questionsState).filter(
      ({ isValid, value }) => value.length > 0
    ).length < 1;
  const requiredPattern = /.+/;

  /*
   覺得 rende 這裡寫得蠻糟的，超亂... 
  
   原本是想用 DOM 自己的 validate API 來做
   在 input 上下 pattern, maxLangth 等等的屬性，然後在用 element.validaty.valid 這個 api 看看正不正確
   但是 pattern 這個屬性似乎沒辦法用
  */

  return (
    <StyledForm onSubmit={handleSubmit}>
      {((name) => (
        <Question
          title="暱稱"
          isEmpty={questionsState[name].value.length < 1}
          isValid={questionsState[name].isValid}
          errMessage={"暱稱必須大於五個字元"}
          required
        >
          <input
            placeholder="您的姓名"
            name={name}
            value={questionsState[name].value}
            onChange={(e) => checkQuestionState(e, /.{5,10}/g)}
            required
          ></input>
        </Question>
      ))("nickname")}
      {/* 上面這個狀況是可行的，不過還是覺的醜醜的 */}
      <Question
        title="Email"
        isEmpty={email.value.length < 1}
        isValid={email.isValid}
        errMessage={"請輸入正確 email 格式"}
        required
      >
        <input
          type="email"
          placeholder="test@test.com"
          name="email"
          value={email.value}
          onChange={(e) => checkQuestionState(e, EMAIL_REGEXP)}
          required
        ></input>
      </Question>
      <Question
        title="手機號碼"
        isEmpty={phone.value.length < 1}
        isValid={phone.isValid}
        errMessage={"請輸入正確的手機格式"}
        required
      >
        <input
          placeholder="0987654321"
          name="phone"
          value={phone.value}
          onChange={(e) => checkQuestionState(e, /09[0-9]{8}/)}
        ></input>
      </Question>
      <Question title="報名類型" isEmpty={type.value.length < 1} required>
        <div>
          <input
            type="radio"
            name="type"
            value="good"
            onChange={(e) => checkQuestionState(e, requiredPattern)}
            checked={type.value === "good"}
            required
          ></input>
          <label htmlFor="bed"> 躺在床上用想像力實作</label>
        </div>
        <div>
          <input
            type="radio"
            name="type"
            value="bad"
            onChange={(e) => checkQuestionState(e, requiredPattern)}
            checked={type.value === "bad"}
            required
          ></input>
          <label htmlFor="floor"> 趴在地上滑手機找現成的</label>
        </div>
      </Question>
      <Question
        title="怎麼知道這個活動的"
        isEmpty={type.value.length < 1}
        required
      >
        <input
          name="howToKnow"
          value={howToKnow.value}
          onChange={(e) => checkQuestionState(e, requiredPattern)}
          required
        ></input>
      </Question>
      <Question
        title="其他"
        remark="對活動的一些建議"
        isEmpty={type.value.length < 1}
      >
        <input
          name="other"
          value={other.value}
          onChange={(e) => checkQuestionState(e)}
        ></input>
      </Question>
      <Submit type="submit" value="提交" />
      <ErrMsg>{!isFinish && !isEmptyForm && "還沒完成喔～"}</ErrMsg>
    </StyledForm>
  );
}
