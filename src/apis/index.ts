import axios, { AxiosResponse } from "axios"
import { IdCheckRequestDto, SignInRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request/auth"
import { ResponseDto } from "./dto/response";
import { SignInResponseDto } from "./dto/response/auth";
import { GetChargedCustomerListResponseDto, GetNurseListResponseDto, GetNurseResponseDto, GetSignInResponseDto } from "./dto/response/nurse";
import { PatchToolRequestDto, PostToolRequestDto } from "./dto/request/tool";
import { GetToolListResponseDto, GetToolReponseDto } from "./dto/response/tool";
import { GetCareRecordResponseDto, GetCustomerListResponseDto, GetCustomerReponseDto } from "./dto/response/customer";
import { error } from "console";
import { PatchCustomerRequestDto, PostCareRecordRequestDto, PostCustomerRequestDto } from "./dto/request/customer";
import { access } from "fs";
import { PatchNurseRequestDto } from "./dto/request/nurse";

// variable: API URL 상수 //
const SENICARE_API_DOMAIN = 'http://localhost:4000';

const AUTH_MODULE_URL = `${SENICARE_API_DOMAIN}/api/v1/auth`;
const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;

const NURSE_MODULE_URL = `${SENICARE_API_DOMAIN}/api/v1/nurse`; 
const GET_NURSE_LIST_API_URL = `${NURSE_MODULE_URL}`
const GET_NURSE_API_URL = (userId: string) => `${NURSE_MODULE_URL}/${userId}`;
const GET_SIGN_IN_API_URL = `${NURSE_MODULE_URL}/sign-in`;
const PATCH_NURSE_API_URL = `${NURSE_MODULE_URL}`;
const GET_CHARGED_CUSTOMER_API_URL = (userId: string) => `${NURSE_MODULE_URL}/${userId}/customers`;

const TOOL_MODULE_URL = `${SENICARE_API_DOMAIN}/api/v1/tool`;
const POST_TOOL_API_URL = `${TOOL_MODULE_URL}`;
const GET_TOOL_LIST_API_URL = `${TOOL_MODULE_URL}`;
const GET_TOOL_API_URL = (toolNumber: number | string ) => `${TOOL_MODULE_URL}/${toolNumber}`
const PATCH_TOOL_API_URL = (toolNumber: number | string ) => `${TOOL_MODULE_URL}/${toolNumber}`
const DELETE_TOOL_API_URL = (toolNumber: number | string ) => `${TOOL_MODULE_URL}/${toolNumber}`

const CUSTOMER_MODULE_URL = `${SENICARE_API_DOMAIN}/api/v1/customer`;
const POST_CUSTOMER_API_URL = `${CUSTOMER_MODULE_URL}`
const GET_CUSTOMER_LIST_API_URL = `${CUSTOMER_MODULE_URL}`;
const GET_CUSTOMER_API_URL = (customerNumber: number | string ) => `${CUSTOMER_MODULE_URL}/${customerNumber}`
const PATCH_CUSTOMER_API_URL = (customerNumber: number | string ) => `${CUSTOMER_MODULE_URL}/${customerNumber}`
const DELETE_CUSTOMER_API_URL = (customNumber: number | string ) => `${CUSTOMER_MODULE_URL}/${customNumber}`

const GET_CARE_RECORD_LIST_API_URL = (customerNumber: number | string ) => `${CUSTOMER_MODULE_URL}/${customerNumber}/care-records`
const POST_CARE_RECORD_API_URL = (customerNumber: number | string) => `${CUSTOMER_MODULE_URL}/${customerNumber}/care-record`


// function: Authorization Bearer Header //
const bearerAuthorization = (accessToken: string) => ({ headers: { 'Authorization': `Bearer ${accessToken}` }});


const FILE_UPLOAD_URL = `${SENICARE_API_DOMAIN}/file/upload`;

const multipart = {headers: { 'Content-Type': 'multipart/form-data' } };

// function: file upload 요청 함수 //
export const fileUploadeRequest = async (requestBody: FormData) => {
    const url = await axios.post(FILE_UPLOAD_URL, requestBody, multipart)
        .then(responseDataHandler<string>)
        .catch(error => null);
    return url;
};

// function: response data 처리 함수 //
const responseDataHandler = <T>(response: AxiosResponse<T, any>) => {
    const { data } = response;
    return data;
};

// function: response error 처리 함수 //
const responseErrorHandler = (error: any) => {
    if (!error.response) return null;
    const { data } = error.response;
    return data as ResponseDto;
};

// function: id check api 요청 함수 //
export const IdCheckRequest = async (requestBody: IdCheckRequestDto) => {
    const responseBody = await axios.post(ID_CHECK_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: tel auth api 요청 함수 //
export const telAuthRequest = async (requestBody: TelAuthRequestDto) => {
    const responseBody = await axios.post(TEL_AUTH_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: tel auth check 요청 함수 //
export const telAuthCheckRequest = async (requestBody: TelAuthCheckRequestDto) => {
    const responseBody = await axios.post(TEL_AUTH_CHECK_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
};

// function: sign up 요청 함수 //
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const responseBody = await axios.post(SIGN_UP_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
};

// function: sign in 요청 함수 //
export const signInRequest = async (requestBody: SignInRequestDto) => {
    const responseBody = await axios.post(SIGN_IN_API_URL, requestBody)
        .then(responseDataHandler<SignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get nurse list 요청 함수 //
export const getNurseListRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_NURSE_LIST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetNurseListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get nurse 요청 함수 //
export const getNurseRequest = async (userId: string, accessToken: string) => {
    const responseBody = await axios.get(GET_NURSE_API_URL(userId), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetNurseResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
};

// function: get sign in 요청 함수 //
export const getSignInRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_SIGN_IN_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: patch nurse 요청 함수 //
export const patchNurseRequest = async (requestBody: PatchNurseRequestDto, accessToken: string) => {
    const responseBody = await axios.patch(PATCH_NURSE_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get charged customer 요청 함수 //
export const getChargedCustomerRequest = async (userId: string, accessToken: string) => {
    const responseBody = await axios.get(GET_CHARGED_CUSTOMER_API_URL(userId), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetChargedCustomerListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: post tool 요청 함수 //
export const postToolRequest = async (requestBody: PostToolRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_TOOL_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get tool list 요청 함수 //
export const getToolListRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_TOOL_LIST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetToolListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get tool 요청 함수 //
export const getToolRequest = async (toolNumber:number | string, accessToken: string) => {
    const responseBody = await axios.get(GET_TOOL_API_URL(toolNumber), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetToolReponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
};

// function: patch tool 요청 함수 //
export const patchToolReqeust = async (toolNumber:number | string, requestBody: PatchToolRequestDto ,accessToken: string) => {
    const responseBody = await axios.patch(PATCH_TOOL_API_URL(toolNumber), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
};

// function: delete tool 요청 함수 //
export const deleteToolRequest = async (toolNumber: number | string, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_TOOL_API_URL(toolNumber), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
};

// function: post customer 요청 함수 //
export const postCustomerReqeust = async (requestBody: PostCustomerRequestDto, accessToken:string) => {
    const responseBody = await axios.post(POST_CUSTOMER_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get customer list 요청 함수 //
export const getCustomerListReqeust = async (accessToken: string) => {
    const responseBody = await axios.get(GET_CUSTOMER_LIST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetCustomerListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get customer 요청 함수 //
export const getCustomerRequest = async ( customerNumber: number | string , accessToken:string ) => {
    const responseBody = await axios.get(GET_CUSTOMER_API_URL(customerNumber), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetCustomerReponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
};

// function: patch customer 요청 함수 //
export const patchCustomerRequest = async ( requestBody:PatchCustomerRequestDto,customerNumber: number | string, accessToken:string) => {
    const responseBody = await axios.patch(PATCH_CUSTOMER_API_URL(customerNumber), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: delete customer 요청 함수 //
export const deleteCustomerRequest = async (customerNumber:number | string, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_CUSTOMER_API_URL(customerNumber), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: get care record list 요청 함수 //
export const getCareRecordListRequest =async (customerNumber: number | string, accessToken:string) => {
    const responseBody = await axios.get(GET_CARE_RECORD_LIST_API_URL(customerNumber), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetCareRecordResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
};

// function: post care record 요청 함수 //
export const postCareRecordRequest = async (requestBody: PostCareRecordRequestDto, customerNumber: number | string, accessToken: string) => {
    const responseBody = await axios.post(POST_CARE_RECORD_API_URL(customerNumber), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
};
