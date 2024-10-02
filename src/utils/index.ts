import dayjs from "dayjs";

// function: YYMMDD 형태의 생년월일로 만 나이 구하기 함수 //
export const calculateAge = (birthString: string)=> {  // 010901
    const yearString = birthString.substring(0,2);
    const monthString = birthString.substring(2,4);
    const dayString = birthString.substring(4,6);

    const birth = dayjs(`19${yearString}-${monthString}-${dayString}`);
    const today = dayjs();

    let age = today.year() - birth.year();
    if (today.isBefore(birth.add(age, 'year'))) age--;

    return age;
};