import axios from "axios"
import { IdCheckRequestDto } from "./dto/request/auth"
import { ResponseDto } from "./dto/response";

// function: id check api 요청 함수
export const IdCheckRequest = async (requestBody: IdCheckRequestDto) => {
    const responseBody = await axios.post("http://localhost:4000/api/v1/auth/id-check", requestBody)
    .then(response => {
        const { data  } = response;
        return data as ResponseDto;
    })
    .catch(error => {
        if (!error.response) return null;
        const { data } = error.response;
        return data as ResponseDto;
    });
    return responseBody;
}