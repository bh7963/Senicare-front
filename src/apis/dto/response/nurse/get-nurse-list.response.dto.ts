import { Nurse } from "src/types";
import ResponseDto from "../response.dto";

// interface: get nurse list Response Body Dto //
export default interface GetNurseListResponseDto extends ResponseDto {
    nurses: Nurse[];
}