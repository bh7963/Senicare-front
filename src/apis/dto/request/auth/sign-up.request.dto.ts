// interface: 회원가입 Reuqest Body Dto //
export default interface SignUpRequestDto{
    name: string;
    userId: string;
    password: string;
    telNumber: string;
    authNumber: string;
    joinPath: string;
    snsId?: string;
}