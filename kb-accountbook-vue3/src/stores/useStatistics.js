import axios from 'axios'; // axios 모듈 가져오기
import { ref, onMounted, computed } from 'vue'; // Vue Composition API에서 사용할 ref, onMounted, computed 가져오기

export function useStatistics() {
  // 통계를 위한 커스텀 훅 정의

  // 데이터와 각종 상태 변수들을 ref로 정의 ref로 정의를 하지 않으면
  //ref를 사용하면 리액티브 상태를 만들 수 있어,
  //값이 변경될 때마다 컴포넌트가 자동으로 다시 렌더링됩니다.

  const data = ref(null); // 데이터
  const incomeChartData = ref(null); // 수입 차트 데이터
  const expenseChartData = ref(null); // 지출 차트 데이터
  const incomeDetails = ref({}); // 수입 상세 데이터
  const expenseDetails = ref({}); // 지출 상세 데이터
  const incomeCategoriesCount = ref(0); // 수입 카테고리 수
  const expenseCategoriesCount = ref(0); // 지출 카테고리 수
  const incomeData = ref({}); // 수입 데이터
  const expenseData = ref({}); // 지출 데이터
  const incomeColors = ref([]); // 수입 색상 배열
  const expenseColors = ref([]); // 지출 색상 배열
  const showIncome = ref(false); // 수입 표시 여부
  const showExpense = ref(true); // 지출 표시 여부
  const savings = ref([]); // 저축 목표 데이터
  const totalExpense = ref(0); // 총 지출

  //fetchData 함수는 비동기적으로 서버에서 데이터를 가져오는 역할을 합니다.
  //axios를 사용하여 HTTP 요청을 보내고, 받은 데이터를 해당하는 변수에 할당합니다. 데이터를 가져오는 과정에서 오류가 발생할 경우 적절한 예외 처리를 합니다.
  const fetchData = async () => {
    try {
      const response = await axios.get('/db.json'); // 서버에서 데이터 가져오기
      data.value = response.data; // 가져온 데이터를 데이터 변수에 할당

      // 수입 카테고리와 지출 카테고리에 대한 맵 생성
      const incomeCategoryMap = Object.fromEntries(
        data.value.incomeCategories.map((cat) => [cat.id, cat.name])
      );
      const expenseCategoryMap = Object.fromEntries(
        data.value.expenseCategories.map((cat) => [cat.id, cat.name])
      );

      // 수입과 지출 데이터 추출 및 계산
      const income = data.value.budget
        .filter((item) => item.type === '수입')
        .reduce((acc, curr) => {
          const category = incomeCategoryMap[curr.category] || curr.category;
          const amount = parseInt(curr.amount);
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += amount;
          return acc;
        }, {});

      const expense = data.value.budget
        .filter((item) => item.type === '지출')
        .reduce((acc, curr) => {
          const category = expenseCategoryMap[curr.category] || curr.category;
          const amount = parseInt(curr.amount);
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += amount;
          return acc;
        }, {});

      // 총 지출 계산
      totalExpense.value = Object.values(expense).reduce((a, b) => a + b, 0);
      const totalIncome = Object.values(income).reduce((a, b) => a + b, 0);

      // 수입과 지출 데이터, 상세 데이터 할당
      incomeData.value = income;
      expenseData.value = expense;

      // 색상 배열 정의 정의를 해주지 않으면 귀찬게 되드라구여 그냥 정의했음
      const incomeColorsArray = [
        '#4caf50', // 진한 녹색
        '#8bc34a', // 라임색
        '#cddc39', // 라임 라이트
        '#ffeb3b', // 밝은 노란색
        '#ffc107', // 호박색
        '#ff9800', // 주황색
        '#ff5722', // 진한 주황색
        '#f44336', // 빨간색
        '#e91e63', // 핫핑크
        '#9c27b0', // 보라색
        '#673ab7', // 인디고
        '#3f51b5', // 인디고 라이트
        '#2196f3', // 파란색
        '#03a9f4', // 밝은 파란색
        '#00bcd4', // 청록색
        '#009688', // 에메랄드 그린
        '#795548', // 브라운
        '#607d8b', // 블루 그레이
      ];

      const expenseColorsArray = [
        '#FFB3BA', // 밝은 파스텔 붉은색
        '#FFDFBA', // 밝은 파스텔 주황색
        '#FFB347', // 파스텔 오렌지색
        '#FFD1DC', // 밝은 파스텔 핑크색
        '#FF9AA2', // 중간 밝기 파스텔 붉은색
        '#FFB7B2', // 파스텔 붉은색
        '#FFDAC1', // 파스텔 오렌지색
        '#FFC3A0', // 파스텔 살구색
        '#FFB6C1', // 파스텔 연분홍색
        '#FFC0CB', // 파스텔 핑크색
        '#FFDAB9', // 파스텔 복숭아색
        '#FFE4E1', // 파스텔 장미색
        '#FFE4B5', // 파스텔 밀감색
        '#FFA07A', // 파스텔 라이트 살몬색
        '#FF7F50', // 파스텔 코랄색
        '#FF6F61', // 파스텔 로즈색
        '#FF4500', // 파스텔 오렌지레드색
        '#FF6347', // 파스텔 토마토색
      ];
      // 정렬된 수입과 지출 데이터 생성 솔팅하지 않으면 높은거 순서대로 정렬이 안됨
      const sortedIncomeEntries = Object.entries(income).sort(
        ([, a], [, b]) => b - a
      );
      const sortedExpenseEntries = Object.entries(expense).sort(
        ([, a], [, b]) => b - a
      );
      const sortedIncome = Object.fromEntries(sortedIncomeEntries);
      const sortedExpense = Object.fromEntries(sortedExpenseEntries);

      // 수입 및 지출 상세 정보 및 색상 정의 여기서 색상을 받아와서 하지 않으면 색상이 다시 지맘대로 정렬되서 보임
      // 그렇기에 acc가 추가 된것임
      incomeDetails.value = Object.entries(sortedIncome).reduce(
        (acc, [key, value]) => {
          acc[key] = {
            percentage: ((value / totalIncome) * 100).toFixed(2),
            amount: value,
          };
          return acc;
        },
        {}
      );
      expenseDetails.value = Object.entries(sortedExpense).reduce(
        (acc, [key, value]) => {
          acc[key] = {
            percentage: ((value / totalExpense.value) * 100).toFixed(2),
            amount: value,
          };
          return acc;
        },
        {}
      );
      incomeColors.value = sortedIncomeEntries.map(
        ([,], index) => incomeColorsArray[index % incomeColorsArray.length]
      );
      expenseColors.value = sortedExpenseEntries.map(
        ([,], index) => expenseColorsArray[index % expenseColorsArray.length]
      );

      // 차트 데이터 생성 인컴 데이터와 소비 데이터를 따로 분류하고자 했음 데이터 베이스가 바꿨기 떄무네
      incomeChartData.value = {
        labels: Object.keys(sortedIncome),
        datasets: [
          {
            label: 'Income by Category',
            backgroundColor: incomeColors.value,
            data: Object.values(sortedIncome),
          },
        ],
      };
      expenseChartData.value = {
        labels: Object.keys(sortedExpense),
        datasets: [
          {
            label: 'Expenses by Category',
            backgroundColor: expenseColors.value,
            data: Object.values(sortedExpense),
          },
        ],
      };

      // 카테고리 수 계산 만일 카테고리의 수가 추가된다면 혹시나~
      incomeCategoriesCount.value = Object.keys(sortedIncome).length;
      expenseCategoriesCount.value = Object.keys(sortedExpense).length;

      // 저축 데이터 할당 저축데이터는 윌가 목표하는 금액을 의미
      savings.value = data.value.saving.map((item) => ({
        id: item.id,
        goal: parseInt(
          item.categoryAllowance.replace(/,/g, '').replace('원', '')
        ),
      }));
    } catch (error) {
      // 에러 발생 시 처리 즉 널이 나오거나 값이 나오지 않으면 예외 처리!! 주요!
      console.error('Error fetching data:', error.message);
      console.error(
        error.response ? error.response.data : 'No response from server'
      );
    }
  };

  // 수입, 지출 표시 전환 함수
  //toggleView 함수는 수입과 지출을 표시하는 변수인 showIncome, showExpense를 변경하여
  //차트를 표시하거나 숨길 수 있습니다.
  const toggleView = (type) => {
    if (type === 'income') {
      showIncome.value = true;
      showExpense.value = false;
    } else if (type === 'expense') {
      showIncome.value = false;
      showExpense.value = true;
    }
  };

  // formatAmount, calculateAchievement, calculateRisk 함수들은 각각 금액을 특정 형식으로 포맷하거나,
  //달성률과 위험 수준을 계산하는 역할을 합니다.
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return '0';
    return amount.toLocaleString();
  };

  // 달성률 계산 함수
  const calculateAchievement = (goal, totalExpense) => {
    if (goal === 0) return 0;
    return Math.min((totalExpense / goal) * 100, 100).toFixed(2);
  };

  // 위험 계산 함수
  const calculateRisk = (goal, totalExpense) => {
    const achievement = calculateAchievement(goal, totalExpense);
    if (achievement >= 75) {
      return 'High';
    } else if (achievement >= 50) {
      return 'Medium';
    } else {
      return 'Low';
    }
  };

  // sortedIncomeDetails, sortedExpenseDetails, sortedIncomeColors, sortedExpenseColors
  //등은 computed 속성을 사용하여 정렬된 데이터나 색상을 반환합니다.
  //이러한 computed 속성은 상태의 변화에 따라 자동으로 다시 계산되어 리액티브한 동작을 구현할 수 있습니다.
  const sortedIncomeDetails = computed(() => {
    return incomeDetails.value;
  });

  // 정렬된 지출 상세 데이터 컴퓨티드 속성
  const sortedExpenseDetails = computed(() => {
    return expenseDetails.value;
  });

  // 정렬된 수입 색상 컴퓨티드 속성
  const sortedIncomeColors = computed(() => {
    return incomeColors.value;
  });

  // 정렬된 지출 색상 컴퓨티드 속성
  const sortedExpenseColors = computed(() => {
    return expenseColors.value;
  });

  // 컴포넌트가 마운트될 때 데이터를 가져오는 훅
  //onMounted 훅은 컴포넌트가 처음으로 마운트될 때 실행되는 로직을 정의합니다.
  //여기서는 fetchData 함수를 호출하여 초기 데이터를 가져옵니다.
  onMounted(fetchData);

  // 반환되는 객체에는 위에서 정의한 모든 변수와 함수가 포함됨
  return {
    data,
    incomeChartData,
    expenseChartData,
    sortedIncomeDetails,
    sortedExpenseDetails,
    incomeCategoriesCount,
    expenseCategoriesCount,
    incomeData,
    expenseData,
    sortedIncomeColors,
    sortedExpenseColors,
    formatAmount,
    calculateAchievement,
    calculateRisk,
    showIncome,
    showExpense,
    toggleView,
    savings,
    totalExpense,
  };
}
