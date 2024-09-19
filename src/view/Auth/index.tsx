import React, { ChangeEvent, useEffect, useState } from 'react'
import './style.css';
import InputBox from 'src/components/InputBox';
import axios from 'axios';
import { IdCheckRequest, signInRequest, signUpRequest, telAuthCheckRequest, telAuthRequest } from 'src/apis';
import { IdCheckRequestDto, SignInRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from 'src/apis/dto/request/auth';
import { request } from 'http';
import { ResponseDto } from 'src/apis/dto/response';

import { useCookies } from 'react-cookie';
import {SignInResponseDto} from 'src/apis/dto/response/auth/';
import { ACCESS_TOKEN, CS_APSOLUTE_PATH, ROOT_PATH } from 'src/constants';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';


type AuthPath = '회원가입' | '로그인';
// interface: SNS 로그인 객체 //
interface SnsContainer {
    type: AuthPath;
    
}
// event handler: SNS버튼 클릭 이벤트 처리
const onSNSButtonClickHandler = (sns: 'kakao' | 'naver') => {
    window.location.href = `http://localhost:4000/api/v1/auth/sns-sign-in/${sns}`
}

// component: SNS 로그인 회원가입 //
function SnsContainer({ type }:SnsContainer) {

    // render: SNS 로그인 회원가입 컴포넌트 렌더링 //
    return (
        <div className="sns-container">
            <div className="title">SNS {type}</div>
            <div className="sns-button-container">
                <div className={`sns-button ${type === '회원가입' ? 'md ':''}kakao`} onClick={()=>{onSNSButtonClickHandler('kakao')}}></div>
                <div className={`sns-button ${type === '회원가입' ? 'md ':''}naver`} onClick={()=>{onSNSButtonClickHandler('naver')}}></div>
            </div>
        </div>
    )
}

interface AuthComponentProps{
    onPathChange : (path: AuthPath) => void;
}
// component: 요양사
function SignUp( {onPathChange }:AuthComponentProps) {

    // state: Query Parameter 상태 //
    const [queryParam] = useSearchParams();
    const snsId = queryParam.get('snsId');
    const joinPath = queryParam.get('joinPath');

    // state: 요양사 정보 입력 상태 //
    const [name, setName] = useState<string>('');
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [telNumber, setTelNumber] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');

    // state: 요양사 메세지 입력 상태 //
    const [nameMessage, setNameMessage] = useState<string>('');
    const [idMessage, setIdMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
    const [telNumberMessage, setTelNumberMessage] = useState<string>('');
    const [authNumberMessage, setAuthNumberMessage] = useState<string>('');

    // state: 요양사 메세지 에러 상태 //
    const [nameMessageError, setNameMessageError] = useState<boolean>(false);
    const [idMessageError, setIdMessageError] = useState<boolean>(false);
    const [passwordMessageError, setPasswordMessageError] = useState<boolean>(false);
    const [passwordCheckMessageError, setPasswordCheckMessageError] = useState<boolean>(false);
    const [telNumberMessageError, setTelNumberMessageError] = useState<boolean>(false);
    const [authNumberMessageError, setAuthNumberMessageError] = useState<boolean>(false);
    
    // state: 요양사 정보 확인 상태 //
    const [isCheckedId, setCheckedId] = useState<boolean>(false);
    const [isMatchedPassword, setMatchedPassword] = useState<boolean>(false);
    const [isCheckedPassword, setCheckedPassword] = useState<boolean>(false);
    const [isSendTelNumber, setSendTelNumber] = useState<boolean>(false);
    const [isCheckedAuthNumber, setCheckedAuthNumber] = useState<boolean>(false);

    // variable: SNS 회원가입 여부 //
    const isSnsSignUp = snsId !== null && joinPath !== null;

    // variable: 회원가입 가능 여부 //
    const isComplete = name && id && isCheckedId && password && passwordCheck && isMatchedPassword && isCheckedPassword
    && telNumber && isSendTelNumber && authNumber && isCheckedAuthNumber;

    // function: 아이디 중복 확인 Response처리 함수 //
    const idCheckResponse = (responseBody: ResponseDto | null) => {

        const message = 
        !responseBody ? '서버에 문제가 있습니다. ':
        responseBody.code === 'VF' ? '올바른 데이터가 아닙니다. ':
        responseBody.code === 'DI' ? '이미 사용중인 아이디 입니다. ':
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ':
        responseBody.code === 'SU' ? '사용가능한 아이디 입니다. ': '';

        const isSuccessed = responseBody !==null && responseBody.code === 'SU';
        setIdMessage(message);
        setIdMessageError(!isSuccessed);
        setCheckedId(isSuccessed);
    };

    // function: 전화번호 인증 Response처리 함수 //
    const telAuthResponse = (responseBody: ResponseDto | null) => {
        
        const message = 
        !responseBody ? '서버에 문제가 있습니다. ':
        responseBody.code === 'VF' ? '숫자 11자 입력해주세요. ':
        responseBody.code === 'DT' ? '이미 사용중인 전화번호 입니다. ':
        responseBody.code === 'TF' ? '서버에 문제가 있습니다.':
        responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ':
        responseBody.code === 'SU' ? '인증번호가 전송되었습니다. ': '';

        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        setTelNumberMessage(message);
        setTelNumberMessageError(!isSuccessed);
        setSendTelNumber(isSuccessed);

    };

    // function: 전화번호 인증 확인 Response 처리 함수 //
    const telAuthCheckResponse = (responseBody: ResponseDto | null) => {
        
        const message =
            !responseBody ? '서버에 문제가 있습니다. ':
            responseBody.code === 'VF' ? '올바른 데이터가 아닙니다. ':
            responseBody.code === 'TAF' ? '인증번호가 일치하지 않습니다. ':
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ':
            responseBody.code === 'SU' ? '인증번호가 확인되었습니다. ': ''

        const isSuccessed = responseBody !== null && responseBody.code ==='SU'; 
        setAuthNumberMessage(message);
        setAuthNumberMessageError(!isSuccessed);
        setCheckedAuthNumber(isSuccessed);
    };

    // function: 회원가입 Response 처리 함수 //
    const signUpResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다. ':
            responseBody.code === 'VF' ? '올바른 데이터가 아닙니다. ':
            responseBody.code === 'DI' ? '중복된 아이디 입니다. ':
            responseBody.code === 'DT' ? '중복된 전화번호 입니다. ':
            responseBody.code === 'TF' ? '서버에 문제가 있습니다.':
            responseBody.code === 'TAF' ? '인증번호가 일치하지 않습니다. ':
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ':
            responseBody.code === 'SU' ? '회원가입에 성공했습니다. ': ''

        const isSuccessed = responseBody !== null && responseBody.code ==='SU';
        if(!isSuccessed){
            alert(message)
            return;
        }
        onPathChange('로그인');
    }
    

    // 변경했을 때 변경되는 이벤트 객체를 매개변수로 받아옴
    // event handler: 이름 변경 이벤트 처리 //
    const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setName(value);

    };

    // event handler: 아이디 변경 이벤트 처리 //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setId(value);
        setCheckedId(false);
        setIdMessage('');
    };
    
    // event handler: 비밀먼호 변경 이벤트 처리 // 
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);

        const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
        const isMatched = pattern.test(value);

        const message = (isMatched || !value) ? '' : '영문, 숫자를 혼용하여 8 ~ 13자 입력해주세요.';
        setPasswordMessage(message);
        setPasswordMessageError(!isMatched);
        setMatchedPassword(isMatched);

    };

    // event handler: 회원가입 버튼 클릭 이벤트 처리 //
    const onSignUpButtonHandler = () => {
        if (!isComplete) return;

        const requestBody: SignUpRequestDto = {
            name,
            userId: id,
            password,
            telNumber,
            authNumber,
            joinPath: joinPath ? joinPath : 'home',
            snsId
        };
        signUpRequest(requestBody).then(signUpResponse)
        
        onPathChange('로그인');

    };
    // effect: 비밀번호 및 비밀번호 확인 변경시  실행할 함수 //
    useEffect(() => {
        if (!password || !passwordCheck) return;

        const isEqual = password === passwordCheck;
        const message = isEqual ? '' : '비밀번호가 일치하지 않습니다.';
        setPasswordCheckMessage(message);
        setPasswordCheckMessageError(!isEqual);
        setCheckedPassword(isEqual)
    }, [password, passwordCheck]);

    // event handler: 비밀번호확인 변경 이벤트 처리 //
    const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPasswordCheck(value);
    };

    // event handler: 전화번호 변경 이벤트 처리 //
    const onTelNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setTelNumber(value);

        setSendTelNumber(false);
        setTelNumberMessage('');
    };

    const onAuthNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setAuthNumber(value);
        setAuthNumberMessage('');
        setCheckedAuthNumber(false);
    };

    // 중복확인 버튼을 클릭했을 때 alert발생
    // 
    const onIdCheckClickHandler = () => {
        if (!id) return;

        const requestBody: IdCheckRequestDto = {
            userId: id
        }
        IdCheckRequest(requestBody).then(idCheckResponse);
    };

    // 전화번호인증 버튼을 클릭했을 때 alert발생
    const onTelNumberSendClickHandler = () => {
        if (!telNumber) return;

        const pattern = /^01([0|1])([0-9]{4})([0-9]{4})$/;
        const isMatched = pattern.test(telNumber);

        if (!isMatched) {
            setTelNumberMessage('숫자 11자 입력해주세요 ');
            setTelNumberMessageError(true);
            return;
        }
        const RequestBody: TelAuthRequestDto = {
            telNumber
        }
        telAuthRequest(RequestBody).then(telAuthResponse);

        // setTelNumberMessage('인증번호가 전송되었습니다.');
        // setTelNumberMessageError(false);
        // setSendTelNumber(true);

    };

    // event handler: 전화번호 인증 이벤트 //
    const onAuthNumberCheckClickHandler = () => {
        if (!authNumber) return;
        
        const requestBody: TelAuthCheckRequestDto = {
            telNumber,
            authNumber
        } 
        telAuthCheckRequest(requestBody).then(telAuthCheckResponse);

        
    };
    // render: 회원가입 화면 컴포넌트 렌더링 //
    return (
        <div style={{ gap: '16px' }} className="auth-box">
            <div className="title-box">
                <div className="title">시니케어</div>
                <div className="logo"></div>
            </div>
            {isSnsSignUp &&
                <SnsContainer type = '회원가입'/>
            }
                <div style={{ width: '64px' }} className="divider"></div>
            
            <div className="input-container">

                <InputBox messageError={nameMessageError} message={nameMessage} value={name} label='이름' type='text' placeholder='이름을 입력해주세요.' onChange={onNameChangeHandler} />
                <InputBox messageError={idMessageError} message={idMessage} value={id} label='아이디' type='text' placeholder='아이디를 입력해주세요.' buttonName='중복확인' onChange={onIdChangeHandler} onButtonClick={onIdCheckClickHandler} />
                <InputBox messageError={passwordMessageError} message={passwordMessage} value={password} label='비밀번호' type='password' placeholder='비밀번호를 입력해주세요.' onChange={onPasswordChangeHandler} />
                <InputBox messageError={passwordCheckMessageError} message={passwordCheckMessage} value={passwordCheck} label='비밀번호 확인' type='password' placeholder='비밀번호를 입력해주세요.' onChange={onPasswordCheckChangeHandler} />
                <InputBox messageError={telNumberMessageError} message={telNumberMessage} value={telNumber} label='전화번호' type='text' placeholder='-빼고 입력해주세요.' buttonName='전화번호 인증' onChange={onTelNumberChangeHandler} onButtonClick={onTelNumberSendClickHandler} />
                {isSendTelNumber &&
                    <InputBox messageError={authNumberMessageError} message={authNumberMessage} value={authNumber} label='인증번호' type='text' placeholder='인증번호 4자리를 입력해주세요.' buttonName='인증 확인' onChange={onAuthNumberChangeHandler} onButtonClick={onAuthNumberCheckClickHandler} />
                }
            </div>

            <div className="button-container">
                <div className={`button ${isComplete ? 'primary' : 'disable'} full-width`} onClick={onSignUpButtonHandler}>회원가입</div>
                <div className="link" onClick={() => onPathChange('로그인')}>로그인</div>
            </div>
        </div>
    )
}

// component: 로그인 화면 컴포넌트 //
function SignIn({ onPathChange }:AuthComponentProps) {

    // state: 쿠키 상태 //

    const [ Cookies, setCookies ] = useCookies();

    // state: 로그인 정보 상태 //
    const [id, setId] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // state: 로그인 입력 메세지 상태 //
    const [message, setMessage] = useState<string>('');

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: 로그인 Response 처리 함수 //
    const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다. ':
            responseBody.code === 'VF' ? '아이디와 비밀번호를 모두 입력하세요. ':
            responseBody.code === 'SF' ? '로그인 정보가 일치하지 않습니다. ':
            responseBody.code === 'TCF' ? '서버에 문제가 있습니다. ':
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ': '';

        const isSuccessed = responseBody !== null && responseBody.code ==='SU';
        if(!isSuccessed) {
            setMessage(message);
            return;
        }
        const { accessToken, expiration } = responseBody as SignInResponseDto;
        const expires = new Date(Date.now() + (expiration * 1000));
        setCookies(ACCESS_TOKEN, accessToken, { path: ROOT_PATH, expires });

        navigator(CS_APSOLUTE_PATH);
        
        
    }

    // event handler: 아이디 변경 이벤트 처리 //
    const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setId(value);
    };
    // event handler: 비밀번호 변경 이벤트 처리 //
    const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);
    };
    // event handler: 로그인 버튼 클릭 이벤트 처리 //
    const onSignUpButtonHandler = () => {    
        
        const requestBody: SignInRequestDto = {
            userId: id,
            password
        }
        signInRequest(requestBody).then(signInResponse);

    }

    // effect: 아이디 및 비밀번호 변경시 실행할 함수 //
    useEffect(()=>{
        setMessage('');
    },[id, password])
    // render: 로그인 화면 컴포넌트 렌더링 //
    return (
        <div className="auth-box">
            <div className="title-box">
                <div className="title">시니케어</div>
                <div className="logo"></div>
            </div>

            <div className="input-container">
                <InputBox value={id} onChange={onIdChangeHandler} message='' messageError type='text' label='아이디' placeholder='아이디를 입력해주세요.' />
                <InputBox value={password} onChange={onPasswordChangeHandler} message={message} messageError type='password' label='비밀번호' placeholder='비밀번호를 입력해주세요.' />
                <div className="button-container">
                    <div id="sign-in-button" className="button primary full-width" onClick={onSignUpButtonHandler}>로그인</div>
                    <div className="link"onClick={()=> onPathChange('회원가입')} >회원가입</div>
                </div>
                <div style={{ width: '64px' }} className="divider"></div>
                <SnsContainer type = '로그인'/>
            </div>
        </div>
    );
};

export default function Auth() {

    // state: Query Parameter 상태 //
    const [queryParam] = useSearchParams();
    const snsId = queryParam.get('snsId');
    const joinPath = queryParam.get('joinPath');
    // state: 선택 화면 상태 //
    const [path, setPath] = useState<AuthPath>('로그인');
    // event handler: path 변경 이벤트 처리 //
    const onPathChangeHandler = (path: AuthPath) => {
        setPath(path);
    }

    // effect: 첫 로드시에 Query Param의 SnsId와 JoinPath 존재시 회원가입 화면 전환 함수 //
    useEffect(() => {
        if (snsId && joinPath) setPath('회원가입');
    }, [])

    return (
        <div id="auth-wrapper">
            <div className="auth-image"></div>
            <div className="auth-container">
                {path === '로그인' ?
                <SignIn onPathChange={onPathChangeHandler}/> : 
                <SignUp onPathChange={onPathChangeHandler}/>}

            </div>
        </div>

    );
};
