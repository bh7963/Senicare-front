import React, { ChangeEvent, useEffect, useState, MouseEvent } from 'react'
import './style.css';
import { usePageination } from 'src/hooks';
import { Nurse } from 'src/types';
import { useCookies } from 'react-cookie';
import Pagination from 'src/components/Pagination';
import { getNurseListRequest } from 'src/apis';
import { ACCESS_TOKEN, HR_APSOLUTE_DETAIL_PATH } from 'src/constants';
import { GetNurseListResponseDto } from 'src/apis/dto/response/nurse';
import { ResponseDto } from 'src/apis/dto/response';
import { useHrDetailUpdateStore, useSignInUserStore } from 'src/stores';
import { useNavigate } from 'react-router';

// interface: 요양사 리스트 아이템 컴포넌트 Properties //
interface TableRowProps {
    nurse: Nurse;
}

// component: 요양사 리스트 아이템 컴포넌트 //
function TableRow({nurse}:TableRowProps) {

    // state: 로그인 유저 상태 //
    const { signInUser } = useSignInUserStore();

    // state: 디테일 수정 화면 상태 //
    const { setUpdate } = useHrDetailUpdateStore();

    // variable: 본인 여부 //
    const isSignInUser = signInUser !== null && nurse.nurseId === signInUser?.userId;

    // function: 네비게이터 함수 //
    const navigator = useNavigate();

    // event handler: 로우 클릭 이벤트 처리 //
    const onRowClickHandler = () => {
        setUpdate(false);
        navigator(HR_APSOLUTE_DETAIL_PATH(nurse.nurseId));
    };

    // event handler: 수정 버튼 클릭 이벤트 처리 //
    const onUpdateButtonClickHandler = (event:MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setUpdate(true);
        navigator(HR_APSOLUTE_DETAIL_PATH(nurse.nurseId));  
    };
    
    // render: 요양사 리스트 아이템 컴포넌트 렌더링
    return(
        <div className='tr' style={{cursor: 'pointer'}}onClick={onRowClickHandler}>
        <div  className='td-nurse-infos' >
                <div className='td-nurse-id'>{nurse.nurseId}</div>
                <div className='td-nurse-name'>{nurse.name}</div>
                <div className='td-nurse-tel'>{nurse.telNumber}</div>
            </div>
            <div className='td-buttons'>
                {isSignInUser &&
                <div className='td-edit'>
                    <div className='icon-button edit' onClick={onUpdateButtonClickHandler}></div>
                </div>
                }
            </div>
        </div>
    );
}

// component: 인사 관리 리스트 컴포넌트 //
export default function Hr() {
    
    // state: cookies 상태 //
    const [cookies] = useCookies();

    // state: 원본 리스트 상태 //
    const [originalList, setOriginalList] = useState<Nurse[]>([]);

    // state: 검색어 상태 //
    const [searchWord, setSearchWord] = useState<string>('');

    // state: 페이징 상태 //
    const {
        currentPage, totalPage, totalCount, viewList,
        setTotalList,initViewList, ...paginationProps
    } = usePageination<Nurse>();

    // function: get nurse list response 처리 함수 //
    const getNurseListResponse = (responseBody: GetNurseListResponseDto | ResponseDto | null) => {
        const message = 
            !responseBody ? '서버에 문제가 있습니다. ':
            responseBody.code === 'AF' ? '잘못된 접근입니다. ':
            responseBody.code === 'DBE' ? '서버에 문제가 있습니다. ': '';
        const isSuccessed = responseBody !== null && responseBody.code === 'SU';
        if (!isSuccessed) {
            alert(message);
            return;
        } 
        const { nurses } = responseBody as GetNurseListResponseDto;
        setTotalList(nurses);
        setOriginalList(nurses);
    };

    // event handler: 검색어 변경 이벤트 처리 //
    const onSearchWordChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchWord(value);
    };

    // event handler: 검색 버튼 클릭 이벤트 처리 //
    const onSearchButtonClickHandler = () => {
        const searchedNurseList = originalList.filter(nurse => nurse.name.includes(searchWord));
        setTotalList(searchedNurseList);
        initViewList(searchedNurseList);
    }

    // effect: 컴포넌트 로드 시 요양사 리스트 불러오기 함수 //
    useEffect(()=>{
        const accessToken = cookies[ACCESS_TOKEN];
        if(!accessToken) return;
        getNurseListRequest(accessToken).then(getNurseListResponse) 
    },[]);

    // render: 인사 관리 리스트 컴포넌트 렌더링 //
    return (
        <div id='hr-wrapper'>
            <div className='top'>
                <div className='top-text'>
                    전체<span className='emphasis'>{totalCount}건</span> | 페이지<span className='emphasis'>{currentPage}/{totalPage}</span>
                </div>
            </div>
            <div className='main'>
                <div className='table'>
                    <div className='th'>
                        <div className='td-nurse-infos'>
                            <div className='td-nurse-id'>요양사 ID</div>
                            <div className='td-nurse-name'>요양사 이름</div>
                            <div className='td-nurse-tel'>전화번호</div>
                        </div>
                        <div className='td-buttons'>
                            <div className='td-edit'>수정</div>
                        </div>
                    </div>
                    {viewList.map((nurse, index) => <TableRow key={index} nurse={nurse}/>)}
                </div>
            </div>
            <div className='bottom'>
                <Pagination currentPage={currentPage} {...paginationProps} />
                <div className='search-box'>
                    <input className='search-input' value={searchWord} placeholder={'검색어를 입력하세요. '} onChange={onSearchWordChangeHandler}/>
                    <div className='button disable' onClick={onSearchButtonClickHandler}>검색</div>
                </div>
            </div>
        </div>
    )
}
