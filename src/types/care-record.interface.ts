export default interface CareRecord {
    recordNumber: number;
    recordDate:string;
    contents:string;
    usedToolName: string | null;
    count: number | null;
}