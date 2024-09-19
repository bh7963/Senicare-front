import { useEffect } from 'react';
import './Senicare.css';
import Auth from 'src/view/Auth';
import { Route, Routes, useNavigate } from 'react-router';
import MainLayout from './layouts/MainLayout';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, AUTH_APSOLUTE_PATH, AUTH_PATH, CS_APSOLUTE_PATH, CS_DETAIL_PATH, CS_PATH, CS_UPDATE_PATH, CS_WRITE_PATH, HR_DETAIL_PATH, HR_PATH, MM_PATH, OTHERS_PATH, ROOT_PATH, SNS_SUCCESS_PATH } from './constants';
import Cs from './view/Cs';
import CSWrite from './view/Cs/Write';
import CSDetail from './view/Cs/Detail';
import CSUpdate from './view/Cs/Update';
import MM from './view/MM';
import Hr from './view/Hr';
import { useSearchParams } from 'react-router-dom';


// component: root path 컴포넌트 //
function Index() {
  // state: 쿠키 상태 //
  const [cookies] = useCookies();

  // function: 네비게이터 함수 //
  const navigator = useNavigate();

  // effect: 마운트 시 경로 이동 effect //
  useEffect(() => {
    if (cookies[ACCESS_TOKEN]) navigator(CS_APSOLUTE_PATH);
    else navigator(AUTH_APSOLUTE_PATH);
  }, []);

  // render: root path 컴포넌트 렌더링 //
  return (
    <></>
  );
}

// component: Sns Success 컴포넌트 //
function SnsSuccess () {
  // state: cookie 상태 //
  const [cookies, setCookie] = useCookies();

  // state: Query Parmeter 상태 //
  const [ queryParam ] = useSearchParams();
  const accessToken = queryParam.get('accessToken');
  const expiration = queryParam.get('expiration');
  const navigator = useNavigate();
  
  // effect: Sns Success 컴포넌트 로드시 accessToken과 expiration을 확인하여 로그인 처리하는 함수 //
  useEffect(() => {
    if (accessToken && expiration){
      const expires = new Date(Date.now() + (Number(expiration) * 1000));
      setCookie(ACCESS_TOKEN, accessToken, {path: ROOT_PATH, expires});
      
      navigator(CS_APSOLUTE_PATH);
    }else navigator(AUTH_APSOLUTE_PATH);
  },[]) 

  // render: sns Sucess 컴포넌트 렌더링
  return <></>;
}

// component: Senicare 컴포넌트 //
export default function Senicare() {

  // render: Senicare 컴포넌트 렌더링 //
  return (
    <Routes>
        <Route index element={<Index />} />
        <Route path={AUTH_PATH} element={<Auth />} />
        <Route path={CS_PATH} element={<MainLayout />}>
            <Route index element={<Cs />} />
            <Route path={CS_WRITE_PATH} element={<CSWrite/>} />
            <Route path={CS_DETAIL_PATH(':customNumber')} element={<CSDetail/>} />
            <Route path={CS_UPDATE_PATH(':customNumber')} element={<CSUpdate/>} />
        </Route>
        <Route path={MM_PATH} element={<MainLayout />}>
            <Route index element={<MM />} />
        </Route>
        <Route path={HR_PATH} element={<MainLayout />}>
            <Route index element={<Hr/>} />
            <Route path={HR_DETAIL_PATH(':userId')} element={<></>} />
        </Route>
        <Route path={SNS_SUCCESS_PATH} element={<SnsSuccess />} />
        <Route path={OTHERS_PATH} element={<Index />} />
    </Routes>
  );
}


