import ResponseDto from "../response.dto";

// interface: get tool response Body Dto//
export default interface GetToolReponseDto extends ResponseDto{
    toolNumber: number;
    name: string;
    purpose: string;
    count: number;
}