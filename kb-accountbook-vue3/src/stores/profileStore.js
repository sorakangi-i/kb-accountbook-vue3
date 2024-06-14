import { defineStore } from 'pinia';
import axios from 'axios';

export const useProfileStore = defineStore('profileStore', {
  state: () => ({
    member: {
      id: 1,
      name: '',
      gender: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      phone: '',
      email: '',
      profilePicture: '',
    },
    savings: [],
    incomeCategories: [],
    expenseCategories: [],
    paymentMethods: [],
    types: [],
    budgets: [],
    periodic: [],
    profileImage: null,
    years: Array.from({ length: 50 }, (v, i) => new Date().getFullYear() - i),
    months: Array.from({ length: 12 }, (v, i) => i + 1),
    days: Array.from({ length: 31 }, (v, i) => i + 1),
  }),

  actions: {
    async fetchProfile() {
      try {
        const response = await axios.get('http://localhost:3000/member/1');
        this.member = response.data;
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    },

    async submitProfile() {
      try {
        const response = await axios.put(
          `http://localhost:3000/member/${this.member.id}`,
          this.member
        );
        if (response.status === 200) {
          alert('프로필이 업데이트 되었습니다.');
        }
      } catch (error) {
        console.error('Error submitting profile:', error);
      }
    },

    async saveImage(file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post(
          'http://localhost:3000/upload',
          formData
        );
        this.profileImage = response.data.path;
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    },

    removeImage() {
      axios
        .delete(`http://localhost:3000/images/${this.profileImage}`)
        .then(() => {
          this.profileImage = null;
        });
    },

    async fetchCategories() {
      try {
        const incomeResponse = await axios.get(
          'http://localhost:3000/incomeCategories'
        );
        const expenseResponse = await axios.get(
          'http://localhost:3000/expenseCategories'
        );
        this.incomeCategories = incomeResponse.data;
        this.expenseCategories = expenseResponse.data;
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    },

    async confirmAddCategory(categoryType, categoryName) {
      try {
        const response = await axios.post(
          `http://localhost:3000/${categoryType}Categories`,
          { name: categoryName }
        );
        if (categoryType === 'income') {
          this.incomeCategories.push(response.data);
        } else {
          this.expenseCategories.push(response.data);
        }
      } catch (error) {
        console.error('Failed to add category:', error);
      }
    },

    async deleteCategory(categoryType, categoryName) {
      try {
        const categories =
          categoryType === 'income'
            ? this.incomeCategories
            : this.expenseCategories;
        const category = categories.find((c) => c.name === categoryName);
        if (category) {
          await axios.delete(
            `http://localhost:3000/${categoryType}Categories/${category.id}`
          );
          if (categoryType === 'income') {
            this.incomeCategories = this.incomeCategories.filter(
              (c) => c.name !== categoryName
            );
          } else {
            this.expenseCategories = this.expenseCategories.filter(
              (c) => c.name !== categoryName
            );
          }
        }
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    },

    async fetchBudgets() {
      try {
        const response = await axios.get('http://localhost:3000/saving');
        this.savings = response.data;
      } catch (error) {
        console.error('Failed to fetch budgets:', error);
      }
    },

    async addBudget(category, amount) {
      try {
        const response = await axios.post('http://localhost:3000/saving', {
          category,
          categoryAllowance: amount,
        });
        this.savings.push(response.data);
      } catch (error) {
        console.error('Failed to add budget:', error);
      }
    },

    async removeBudget(id) {
      try {
        await axios.delete(`http://localhost:3000/saving/${id}`);
        this.savings = this.savings.filter((saving) => saving.id !== id);
      } catch (error) {
        console.error('Failed to remove budget:', error);
      }
    },
  },
});
