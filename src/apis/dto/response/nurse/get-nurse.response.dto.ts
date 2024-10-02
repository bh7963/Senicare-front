import ResponseDto from "../response.dto";

export default interface GetNurseResponseDto extends ResponseDto {
    userId:string;
    name:string;
    telNumber:string;
}