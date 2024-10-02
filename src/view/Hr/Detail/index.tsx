import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'

import './style.css';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, CS_APSOLUTE_PATH, HR_APSOLUTE_PATH } from 'src/constants';
import { getChargedCustomerRequest, getNurseRequest, patchNurseRequest } from 'src/apis';
import { GetChargedCustomerListResponseDto, GetNurseResponseDto } from 'src/apis/dto/response/nurse';
import { ResponseDto } from 'src/apis/dto/response';
import { useNavigate, useParams } from 'react-router';
import { usePageination } from 'src/hooks';
import Pagination from 'src/components/Pagination';
import { ChargedCustomer } from 'src/types';
import { calculateAge } from 'src/utils';
import { useHrDetailUpdateStore, useSignInUserStore } from 'src/stores';
import { click } from '@testing-library/user-event/dist/click';
import { PatchNurseRequestDto } from 'src/apis/dto/request/nurse';

// component: 인사 정보 상세 보기 //
export default function HRDetail() {

    // state: 요양사 아이디 상태 //
    const { userId } = useParams();

    // state: 로그인 유저 상태 //
    const { signInUser } = useSignInUserStore();
    
    // state: 수정 상태  
    const {update, setUpdate} = useHrDetailUpdateStore();

    // state: cookie 상태//
    const [cookies] = useCookies();

    // state: 요양사 정보 상태 //
    const [name, setName] = useState<string>('');
    const [telNumber, setTelNumber] = useState<string>('');

    // state: 요양사 정보 변경 상태 //
    const [updateName, setUpdateName] = useState<string>('');
    const [updateTelNumber, setUpdateTelNumber] = useState<string>('');

    // state: 페이징 상태 //
    const {
        currentPage, totalCount, totalPage, setTotalList, 
        viewList, initViewList, ...paginationProps
    } = usePageination<ChargedCustomer>();

    // variable: //
    const isSignInUser = signInUser?.userId === userId;

    
    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: get nurse response 처리 함수 //
    const getNurseResponse = (responseBody: GetNurseResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다. ': 
            responseBody.code === 'AF' ? '잘못된 접근입니다. ':
            responseBody.code === 'NI' ? '존재하지 않는 사용자 입니다. ':
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ': '';
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            navigator(HR_APSOLUTE_PATH);
            return;
        }
        const { name, telNumber } = responseBody as GetNurseResponseDto;
        setName(name);
        setTelNumber(telNumber);
    };

    // function: get charged customer response 처리 함수 //
    const getChargedCustomerResponse = (responseBody: GetChargedCustomerListResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다. ':
            responseBody.code === 'AF' ? '잘못된 접근입니다. ':
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ': '';
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        const {customers} = responseBody as GetChargedCustomerListResponseDto; 
        setTotalList(customers);
    };

    // function: patch nurse response 처리 함수 //
    const patchNurseResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다. ':
            responseBody.code === 'VF' ? '모든 값을 입력해주세요. ':
            responseBody.code === 'AF' ? '잘못된 접근입니다. ':
            responseBody.code === 'NI' ? '존재하지 않는 사용자 입니다. ':
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다.': ''
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        setUpdate(false);
        if (!userId) return;
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        getNurseRequest(userId, accessToken).then(getNurseResponse);
        };

    // event handler: 목록 버튼 클릭 이벤트 처리 //
    const onListButtonClickHandler = () => {
        navigator(HR_APSOLUTE_PATH);
    };

    // event handler: 요양사 정보 변경 이벤트 처리 //
    const onNameChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setUpdateName(value);
    };

    const onTelNumberChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setUpdateTelNumber(value);
    };

    // event handler: 수정 화면 버튼 클릭 이벤트 처리 //
    const onShowUpdateButtonClick = () => {
        setUpdate(!update);
    };

    // event handler: 수정 취소 버튼 클릭 이벤트 처리 //
    const onUpdateCancleClickHandler = () => {
        setUpdate(false);
    };

    // event handler: 수정 저장 버튼 클릭 이벤트 처리 //
    const onUpdateEnterClickHandler = () => {
        if(!updateName) return;
        if(!isSignInUser) return;
        
        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken) return;

        const requestBody: PatchNurseRequestDto = {
            name: updateName
        };
        patchNurseRequest(requestBody,accessToken).then(patchNurseResponse);
        
    };

    // event handler: 키 다운 이벤트 처리 //
    const onKeyDownHandler = (event:KeyboardEvent<HTMLInputElement>) => {
        const { key } = event;
        if (key === 'Enter') onUpdateEnterClickHandler();
    }

    // effect: 요양사 아이디가 변경될 시 실행할 요양사 정보 불러오기 함수 //
    useEffect(()=>{
        if (!userId) return;
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;

        getNurseRequest(userId, accessToken).then(getNurseResponse);
        getChargedCustomerRequest(userId, accessToken).then(getChargedCustomerResponse);

        // return () => setUpdate(false);
    }, [userId]);

    // effect: update 상태가 변경될 시 실행할 함수 //
    useEffect(()=>{
        setUpdateName(name);
        setUpdateTelNumber(telNumber);
    }, [update, name])

    // render: 인사 정보 상세 보기 화면 컴포넌트 렌더링 //
    return (
        <div id= 'hr-detail-wrapper'>
            <div className= 'top'>
                <div className='info-box'>
                    <div className='label'>아이디</div>
                    <div className='text'>{userId}</div>
                </div>
                <div className='info-box'>
                    <div className='label'>이름</div>
                    {update ?
                    <input value={updateName}className='input' placeholder='이름을 입력해주세요. ' onChange={onNameChangeHandler} onKeyDown={onKeyDownHandler}/>
                    : <div className='text'>{name}</div>}
                </div>
                <div className='info-box'>
                    <div className='label'>전화번호</div>
                    {update ?
                    <input value={updateTelNumber} className='input' placeholder='전화번호를 입력해주세요. ' onChange={onTelNumberChangeHandler}/>
                    :<div className='text'>{telNumber}</div>}
                </div>
            </div>
            <div className= 'middle'>
                <div className='title'>관리 중인 고객 리스트</div>
                <div className='table'>
                    <div className='th'>
                        <div className='td-customer-number'>고객번호</div>
                        <div className='td-customer-name'>이름</div>
                        <div className='td-customer-age'>나이</div>
                        <div className='td-customer-location'>지역</div>
                    </div>
                    {viewList.map((customers, index)=>
                        <div key={index} className='tr'>
                            <div className='td-customer-number'>{customers.customerNumber}</div>
                            <div className='td-customer-name'>{customers.name}</div>
                            <div className='td-customer-age'>{calculateAge(customers.birth)}</div>
                            <div className='td-customer-location'>{customers.location}</div>
                        </div>
                    )}
                </div>
                <div className='middle-bottom'>
                    <Pagination currentPage={currentPage} {...paginationProps} />
                </div>
            </div>
            <div className= 'bottom'>
                <div className='button primary' onClick={onListButtonClickHandler}>목록</div>
                {isSignInUser && (update ? 
                <div className='button-box'>
                    <div className='button disable'onClick={onUpdateCancleClickHandler}>취소</div>
                    <div className='button second' onClick={onUpdateEnterClickHandler}>저장</div>
                </div> :
                <div className='button second' onClick={onShowUpdateButtonClick}>수정</div>
                )}
            </div>
        </div>
    )
}
