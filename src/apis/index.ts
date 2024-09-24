import axios, { AxiosResponse } from "axios"
import { IdCheckRequestDto, SignInRequestDto, SignUpRequestDto, TelAuthCheckRequestDto, TelAuthRequestDto } from "./dto/request/auth"
import { ResponseDto } from "./dto/response";
import { SignInResponseDto } from "./dto/response/auth";
import { GetSignInResponseDto } from "./dto/response/nurse";
import { PatchToolRequestDto, PostToolRequestDto } from "./dto/request/tool";
import { GetToolListResponseDto, GetToolReponseDto } from "./dto/response/tool";

// variable: API URL 상수 //
const SENICARE_API_DOMAIN = 'http://localhost:4000';

const AUTH_MODULE_URL = `${SENICARE_API_DOMAIN}/api/v1/auth`;

const ID_CHECK_API_URL = `${AUTH_MODULE_URL}/id-check`;
const TEL_AUTH_API_URL = `${AUTH_MODULE_URL}/tel-auth`;
const TEL_AUTH_CHECK_API_URL = `${AUTH_MODULE_URL}/tel-auth-check`;
const SIGN_UP_API_URL = `${AUTH_MODULE_URL}/sign-up`;
const SIGN_IN_API_URL = `${AUTH_MODULE_URL}/sign-in`;
const NURSE_MODULE_URL = `${SENICARE_API_DOMAIN}/api/v1/nurse`; 
const GET_SIGN_IN_API_URL = `${NURSE_MODULE_URL}/sign-in`;
const TOOL_MODULE_URL = `${SENICARE_API_DOMAIN}/api/v1/tool`;
const POST_TOOL_API_URL = `${TOOL_MODULE_URL}`;
const GET_TOOL_LIST_API_URL = `${TOOL_MODULE_URL}`;
const GET_TOOL_API_URL = (toolNumber: number | string ) => `${TOOL_MODULE_URL}/${toolNumber}`
const PATCH_TOOL_API_URL = (toolNumber: number | string ) => `${TOOL_MODULE_URL}/${toolNumber}`
const DELETE_TOOL_API_URL = (toolNumber: number | string ) => `${TOOL_MODULE_URL}/${toolNumber}`

// function: Authorization Bearer Header //
const bearerAuthorization = (accessToken: string) => ({ headers: { 'Authorization': `Bearer ${accessToken}` }});

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
}

// function: sign up 요청 함수 //
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const responseBody = await axios.post(SIGN_UP_API_URL, requestBody)
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}

// function: sign in 요청 함수 //
export const signInRequest = async (requestBody: SignInRequestDto) => {
    const responseBody = await axios.post(SIGN_IN_API_URL, requestBody)
        .then(responseDataHandler<SignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get sign in 요청 함수 //
export const getSignInRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_SIGN_IN_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetSignInResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: post tool 요청 함수 //
export const postToolRequest = async (requestBody: PostToolRequestDto, accessToken: string) => {
    const responseBody = await axios.post(POST_TOOL_API_URL, requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get tool list 요청 함수 //
export const getToolListRequest = async (accessToken: string) => {
    const responseBody = await axios.get(GET_TOOL_LIST_API_URL, bearerAuthorization(accessToken))
        .then(responseDataHandler<GetToolListResponseDto>)
        .catch(responseErrorHandler);
    return responseBody;
}

// function: get tool 요청 함수 //
export const getToolRequest = async (toolNumber:number | string, accessToken: string) => {
    const responseBody = await axios.get(GET_TOOL_API_URL(toolNumber), bearerAuthorization(accessToken))
        .then(responseDataHandler<GetToolReponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}

// function: patch tool 요청 함수 //
export const patchToolReqeust = async (toolNumber:number | string, requestBody: PatchToolRequestDto ,accessToken: string) => {
    const responseBody = await axios.patch(PATCH_TOOL_API_URL(toolNumber), requestBody, bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}

// function: delete tool 요청 함수 //
export const deleteToolRequest = async (toolNumber: number | string, accessToken: string) => {
    const responseBody = await axios.delete(DELETE_TOOL_API_URL(toolNumber), bearerAuthorization(accessToken))
        .then(responseDataHandler<ResponseDto>)
        .catch(responseErrorHandler)
    return responseBody;
}