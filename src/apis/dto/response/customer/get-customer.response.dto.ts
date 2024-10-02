import ResponseDto from "../response.dto";

export default interface GetCustomerReponseDto extends ResponseDto {
    customerNumber: number;
    profileImage: string;
    name: string;
    birth: string;
    chargerName: string;
    chargerId:string;
    address: string;
    location: string;
}