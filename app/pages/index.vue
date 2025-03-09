<template>
  <div>
    <div class="mt-10 flex items-center justify-center">
      <div class="w-3/5">
        <div class="rounded-lg border-4 border-gray-300 bg-gray-100 p-4">
          <div class="flex items-center p-2">
            <!-- ID -->
            <div class="mr-1 font-bold">ID</div>
            <div class="rounded-lg bg-red-500 px-1.5 py-0.5 text-center text-xs font-semibold text-white">
              必須
            </div>
          </div>
          <input id="id" v-model="id" type="text" class="w-full rounded-lg border-2 border-gray-200 p-2"
            :class="{ 'rounded-lg border-red-500': errors.id }" />
          <p v-if="errors.id" class="ml-2 text-sm text-red-500">
            IDを入力してください
          </p>

          <!-- パスワード -->
          <div class="flex items-center p-2">
            <div class="mr-1 font-bold">パスワード</div>
            <div class="rounded-lg bg-red-500 px-1.5 py-0.5 text-center text-xs font-semibold text-white">
              必須
            </div>
          </div>
          <input id="password" v-model="password" type="text" class="w-full rounded-lg border-2 border-gray-200 p-2"
            :class="{ 'rounded-lg border-red-500': errors.password }" />
          <p v-if="errors.password" class="ml-2 text-sm text-red-500">
            パスワードを入力してください
          </p>
          <!-- ログインと新規登録の実行 -->
          <button class="mt-4 w-full rounded-lg bg-blue-500 py-2 font-semibold text-white"
            @click="handleChangeLogin">
            {{ isSignUp ? "新規登録" : "ログイン" }}
          </button>
        </div>
        <!-- ログインと新規登録切り替え -->
        <div class="flex items-center justify-center">
          <button class="text-gray-500 text-sm p-2"
            @click="changeToLogin">
            {{ isSignUp ? "ログインする" : "会員登録する" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "@/@types/user";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
const router = useRouter();

const id = ref<string>("");
const password = ref<string>("");

const isSignUp = ref<boolean>(false);
const changeToLogin = () => isSignUp.value = !isSignUp.value;

const errors = reactive({
  id: false,
  password: false,
});

// 会員登録とログインのロジック切り替え
const handleChangeLogin = () => {
  isSignUp.value ? handleSignUp() : handleSignIn();
}

// 会員登録するロジック
const handleSignUp = async () => {
  // バリデーション
  errors.id = !id.value;
  errors.password = !password.value;

  if (errors.id || errors.password) {
    alert("必須項目が入力されていません");
    return;
  }

  // サインアップ
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      id.value,
      password.value,
    );

    const user = userCredential.user;
    const userInfo: User = {
      id: id.value,
      password: password.value,
      userId: user.uid,
    }

    if (user) {
      // ユーザーデータ登録時userId取得
      const userId = await addUserInfo(userInfo);
      router.push(`/member/${userId}/`);
    }
  } catch (error) {
    console.error("サインインエラー", error);
    alert("新規登録に失敗しました");
  }
};

// ログインするロジック
const handleSignIn = async () => {
  // バリデーション
  errors.id = !id.value;
  errors.password = !password.value;

  if (errors.id || errors.password) {
    alert("必須項目が入力されていません");
    return;
  }

  // サインイン
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      id.value,
      password.value,
    );

    const user = userCredential.user;
    if (user) {
      router.push(`/member/${user.uid}/`);
    }
  } catch (error) {
    console.error("サインインエラー", error);
    alert("ログインに失敗しました");
  }
};

// 認証チェック
onMounted(() => {
  getAuth();
  const user = auth.currentUser;
  if (user) {
    router.push(`/member/${user.uid}`);
  }
});
</script>
