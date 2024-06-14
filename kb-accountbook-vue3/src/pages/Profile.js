import { useProfileStore } from '@/stores/profileStore';
import { onMounted, ref, computed } from 'vue';
import './Profile.css';

export default {
  setup() {
    const profileStore = useProfileStore();
    const phonePart1 = ref('010');
    const phonePart2 = ref('');
    const phonePart3 = ref('');
    const selectedCategory = ref('');
    const newCategory = ref('');
    const deleteCategory = ref('');
    const showNewCategoryInput = ref(false);
    const showDeleteCategoryInput = ref(false);
    const profilePictureUrl = ref(null);
    const emailDomains = ref([
      'gmail.com',
      'naver.com',
      'daum.net',
      'hanmail.net',
    ]);
    const emailDomain = ref('');

    onMounted(() => {
      profileStore.fetchProfile();
      profileStore.fetchCategories();
      profileStore.fetchBudgets();
    });

    const submitProfile = async () => {
      profileStore.member.phone = `${phonePart1.value}-${phonePart2.value}-${phonePart3.value}`;
      await profileStore.submitProfile();
      resetForm();
    };

    const resetForm = () => {
      profileStore.member.name = '';
      profileStore.member.gender = '';
      profileStore.member.birthYear = '';
      profileStore.member.birthMonth = '';
      profileStore.member.birthDay = '';
      profileStore.member.email = '';
      profileStore.member.phone = '';
      phonePart1.value = '010';
      phonePart2.value = '';
      phonePart3.value = '';
      selectedCategory.value = '';
      newCategory.value = '';
      deleteCategory.value = '';
      profilePictureUrl.value = null;
      emailDomain.value = '';
      profileStore.savings = [];
    };

    const onFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        profilePictureUrl.value = URL.createObjectURL(file);
        profileStore.saveImage(file);
      }
    };

    const removeImage = () => {
      profilePictureUrl.value = null;
      profileStore.removeImage();
    };

    const validateName = (event) => {
      const charCode = event.keyCode ? event.keyCode : event.which;
      if (charCode >= 48 && charCode <= 57) {
        event.preventDefault();
      }
    };

    const toggleNewCategoryInput = () => {
      showNewCategoryInput.value = !showNewCategoryInput.value;
    };

    const toggleDeleteCategoryInput = () => {
      showDeleteCategoryInput.value = !showDeleteCategoryInput.value;
    };

    const confirmAddCategory = async (type, category) => {
      await profileStore.confirmAddCategory(type, category);
      newCategory.value = '';
    };

    const confirmDeleteCategory = async (type, category) => {
      await profileStore.deleteCategory(type, category);
      deleteCategory.value = '';
    };

    const addNewBudget = () => {
      if (!selectedCategory.value) return;
      profileStore.savings.push({
        id: Date.now(),
        category: selectedCategory.value,
        categoryAllowance: '',
      });
      selectedCategory.value = '';
    };

    const removeSingleBudget = (index) => {
      profileStore.savings.splice(index, 1);
    };

    const filteredCategories = computed(() => {
      const usedCategories = profileStore.savings.map(
        (saving) => saving.category
      );
      return profileStore.expenseCategories.filter(
        (category) => !usedCategories.includes(category.name)
      );
    });

    return {
      profileStore,
      phonePart1,
      phonePart2,
      phonePart3,
      selectedCategory,
      newCategory,
      deleteCategory,
      showNewCategoryInput,
      showDeleteCategoryInput,
      profilePictureUrl,
      emailDomains,
      emailDomain,
      submitProfile,
      onFileChange,
      removeImage,
      validateName,
      toggleNewCategoryInput,
      toggleDeleteCategoryInput,
      confirmAddCategory,
      confirmDeleteCategory,
      addNewBudget,
      removeSingleBudget,
      filteredCategories,
    };
  },
};
