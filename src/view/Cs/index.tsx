import React, { ChangeEvent, useEffect, useState, MouseEvent } from 'react'
import './style.css';
import { usePageination } from 'src/hooks';
import Pagination from 'src/components/Pagination';
import { Customer } from 'src/types';
import { useSignInUserStore } from 'src/stores';
import { deleteCustomerRequest, getCustomerListReqeust } from 'src/apis';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN, CS_APSOLUTE_DETAIL_PATH, CS_APSOLUTE_UPDATE_PATH, CS_APSOLUTE_WRITE_PATH, CS_UPDATE_PATH } from 'src/constants';
import { GetCustomerListResponseDto } from 'src/apis/dto/response/customer';
import { ResponseDto } from 'src/apis/dto/response';
import { calculateAge } from 'src/utils';
import { useNavigate } from 'react-router';

interface TableRowProps {
    customer: Customer;
    getCustomerList : () => void;
}

// component: 고객 리스트 아이템 컴포넌트 //
function TableRow({ customer, getCustomerList }:TableRowProps) {

    // state: 로그인 유저 상태 //
    const { signInUser } = useSignInUserStore();
    const isCharger = signInUser !== null && signInUser.userId === customer.chargerId; 

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // function: delete customer response 처리 함수 //
    const deleteCustomerResponse = (responseBody: ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다. ':
            responseBody.code === 'VF' ? '잘못된 접근입니다. ':
            responseBody.code === 'AF' ? '잘못된 접근입니다. ':
            responseBody.code === 'NC' ? '존재하지 않는 고객입니다. ':
            responseBody.code === 'NP' ? '권한이 없습니다. ':
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ': '';
            
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        }
        getCustomerList();
    }

    // event handler: //
    const onDetailButtonClickHandler = () => {
        navigator(CS_APSOLUTE_DETAIL_PATH(customer.customerNumber));
    }
    // event handler: 수정 버튼 클릭 이벤트 처리 함수 //
    const onUpdateButtonClickHandler = (event:MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        navigator(CS_APSOLUTE_UPDATE_PATH(customer.customerNumber));
    }

    // event handler: 삭제 버튼 클릭 이벤트 처리 함수 //
    const onDeleteButtonClickHandler = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        const isConfirm = window.confirm('정말로 삭제하시겠습니까? ');
        if(!isConfirm) return;

        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken) return;

        deleteCustomerRequest(customer.customerNumber, accessToken).then(deleteCustomerResponse);
    }

    // render: 고객 리스트 아이템 컴포넌트 렌더링 //
    return (
        <div className='tr' onClick={onDetailButtonClickHandler}>
            <div className='td-customer-number'>{customer.customerNumber}</div>
            <div className='td-customer-name'>{customer.name}</div>
            <div className='td-customer-age'>{calculateAge(customer.birth)}</div>
            <div className='td-customer-location'>{customer.location}</div>
            <div className='td-customer-charger'>{customer.chargerName}</div>
            
            {isCharger? <div className='td-buttons'>
                <div className='td-edit'>
                    <div className='icon-button edit' onClick={onUpdateButtonClickHandler}></div>
                </div>
                <div className='td-delete'>
                    <div className='icon-button trash' onClick={onDeleteButtonClickHandler}></div>
                </div>
            </div>
            :
            <div></div>
            }
        </div>
    )
}

// component: 고객 관리 리스트 화면 컴포넌트 //
export default function Cs() {

    // state: cookie 상태 //
    const [cookies] = useCookies();

    // state: 검색어 상태 //
    const [searchWord, setSearchWord] = useState<string>('');

    // state: 원본 리스트 상태 //
    const [ originalList, setOriginalList ] = useState<Customer[]>([])

    // state: 페이징 관련 상태 //
    const {
        currentPage,totalPage,totalCount,
        viewList,setTotalList,initViewList,
        ...paginationProps
    } = usePageination<Customer>();

    // function: 네비게이터 함수 //
    const navigator = useNavigate();


    // function: customer list 불러오기 함수 //
    const getCustomerList = () => {
        const accessToken = cookies[ACCESS_TOKEN];
        if (!accessToken) return;
        getCustomerListReqeust(accessToken).then(getCustomerListResponse);
    }

    // function: get customer list Response 처리 함수 //
    const getCustomerListResponse = (responseBody: GetCustomerListResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다. ':
            responseBody.code === 'AF' ? '잘못된 접근입니다. ':
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ': '';
        
            const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if(!isSuccessed) {
            alert(message);
            return;
        }

        const { customers } = responseBody as GetCustomerListResponseDto;
        setTotalList(customers);
        setOriginalList(customers);
    }

    // event handler: 등록 버튼 클릭 이벤트 처리 함수 //
    const onPostButtonClickHandler = () => {
        navigator(CS_APSOLUTE_WRITE_PATH);
    }

    // event handler: 검색어 상태 변경 이벤트 처리 함수 //
    const onSearchChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchWord(value);
    };

    // event handler: 검색 버튼 클릭 이벤트 처리 함수 //
    const onSearchButtonClickHandler = () => {
        const searchedCustomList = originalList.filter(customer => customer.name.includes(searchWord))
        setTotalList(searchedCustomList)
        initViewList(searchedCustomList)
    };

    // effect: 컴포넌트 로드시 고객 리스트 불러오기 함수 //
    useEffect(getCustomerList,[]);

    // render: 고객 관리 리스트 화면 컴포넌트 렌더링 //
    return (
        <div id= 'cs-wrapper'>
            <div className='top'>
                <div className='top-text'>전체 <span className='emphasis'>{totalCount}건</span> | 페이지 <span className='emphasis'>{currentPage}/{totalPage}</span></div>
                <div className='button primary' onClick={onPostButtonClickHandler}>등록</div>
            </div>
            <div className='main'>
                <div className='table'>
                    <div className='th'>
                        <div className='td-customer-number'>고객번호</div>
                        <div className='td-customer-name'>고객명</div>
                        <div className='td-customer-age'>나이</div>
                        <div className='td-customer-location'>지역</div>
                        <div className='td-customer-charger'>담당자</div>
                        <div className='td-buttons'>
                            <div className='td-edit'>수정</div>
                            <div className='td-delete'>삭제</div>
                        </div>
                    </div>
                    {viewList.map((customer, index) => <TableRow key={index} customer={customer} getCustomerList={getCustomerList}/>)}
                </div>
            </div>
            <div className='bottom'>
                <Pagination currentPage={currentPage} { ...paginationProps }/>
                <div className='search-box'>
                    <input value={searchWord} className='search-input' placeholder='검색어를 입력하세요. ' onChange={onSearchChangeHandler}/>
                    <div className='button disable' onClick={onSearchButtonClickHandler}>검색</div>
                </div>
            </div>
        </div>
    )
}
