import { IUserWordCreate } from '../../../API/types';

export function createUserWord(answer: boolean): IUserWordCreate {
  return answer
    ? {
        difficulty: 'no',
        optional: {
          learned: false,
          success: 1,
          fail: 0,
          series: 1,
        },
      }
    : {
        difficulty: 'no',
        optional: {
          learned: false,
          success: 0,
          fail: 1,
          series: 0,
        },
      };
}
