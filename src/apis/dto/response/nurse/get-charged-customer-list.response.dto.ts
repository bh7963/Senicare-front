import { ChargedCustomer } from "src/types";
import ResponseDto from "../response.dto";

export default interface GetChargedCustomerListResponseDto extends ResponseDto {
    customers: ChargedCustomer[];
}