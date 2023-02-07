import axios, { AxiosStatic, AxiosResponse } from "axios";

// https://kauth.kakao.com/oauth/authorize?client_id=a80bddc122d84096982a35f400c7ead5&response_type=code&redirect_uri=http://localhost:8080/login

const KAKAO_REST_API_KEY = "a80bddc122d84096982a35f400c7ead5";
const KAKAO_JAVASCRIPT_KEY = "cc9ea08bcb8a8a33b8f0a06d4e582297";

const KAKAO_AUTH_CODE =
  "tXs9Wohhdj7xGwJ6qq9v1rgugZnjbQrq3lz72SUxCXu9JFJ88nM1Xu6xA_YvcullghwM0Qo9dNkAAAGGFSRVxg";

// let getAuthCode = (): Promise<AxiosResponse> =>
//   axios.get("https://kauth.kakao.com/oauth/authorize", {
//     params: {
//       client_id: KAKAO_REST_API_KEY,
//       redirect_url: "http://localhost:8080",
//       response_type: "code",
//     },
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
//     },
//   });

async function getUserToken(): Promise<AxiosStatic> {
  return axios.post(
    "https://kauth.kakao.com/oauth/token",
    JSON.stringify({
      grant_type: "authorization_code",
      client_id: KAKAO_REST_API_KEY,
      redirect_url: "http://localhost:8080/monitoring",
      code: KAKAO_AUTH_CODE,
      client_secret: "vypkSpQPqG8xz7RtIpQrfMOAPILMWH02",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );
}

function loginKakao(): void {
  window.Kakao.init(KAKAO_JAVASCRIPT_KEY);
  // if (!window.Kakao.isInitialized()) return false;
  window.Kakao.Auth.authorize({
    redirectUri: "http://localhost:8080/login",
  });
}

export default {
  loginKakao,
  getUserToken,
};
