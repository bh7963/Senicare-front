import ResponseDto from "../response.dto";


// interface: 
export default interface SignInResponseDto extends ResponseDto{
    accessToken: string;
    expiration: number;

}