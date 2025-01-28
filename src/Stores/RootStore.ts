import { observable, action,  makeAutoObservable } from "mobx"
import { setAuthToken } from "../Services/api"
import { jwtDecode }  from "jwt-decode"


interface UserData {
  username: string
  email: string
  exp: number
}

function getCookieToken(): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

function setCookieWithValidation(name: string, value: string, options: { expires?: Date; path?: string; secure?: boolean }) {
    // Пытаемся установить куку
    let cookieString = `${name}=${encodeURIComponent(value)}`;
    if (options.expires) cookieString += `; expires=${options.expires.toUTCString()}`;
    if (options.path) cookieString += `; path=${options.path}`;
    if (options.secure) cookieString += "; Secure";
    cookieString += "; SameSite=Strict";
  
    document.cookie = cookieString;
  
    // Проверяем, установилась ли кука
    const isCookieSet = document.cookie.includes(`${name}=`);
    if (!isCookieSet) {
      const errorMessages = [];
      
      // Проверяем возможные причины
      if (options.expires && options.expires.getTime() < Date.now()) {
        console.log("expires: "+options.expires+ ", Date: "+ Date())
        console.log("expires (UTC):", options.expires.toUTCString());
        console.log("Current date (UTC):", new Date().toUTCString());

        errorMessages.push("Срок действия уже истек.");
      }
      if (options.secure && location.protocol !== "https:") {
        errorMessages.push("Кука требует HTTPS.");
      }
      if (/([;=])\s*/.test(name + value)) {
        errorMessages.push("Некорректные символы в имени/значении.");
      }
  
      throw new Error(`Не удалось установить куку: ${errorMessages.join(" ")}`);
    }
}
  

class AuthStore {
  isAuthenticated = false
  userData: UserData | null = null

  constructor() {
    makeAutoObservable(this)
    this.loadAuthState()
  }

  setAuth(isAuthenticated: boolean, userData: UserData | null) {
    this.isAuthenticated = isAuthenticated
    this.userData = userData
  }
  

  loadAuthState() {
    const token = getCookieToken(); // <-- Используем куки вместо localStorage
    if (token) {
      try {
        const decoded: UserData = jwtDecode(token);
        this.setAuth(true, decoded);
        setAuthToken(token);
      } catch (error) {
        console.error("Invalid token:", error);
        this.logout();
      }
    }
  }

  login(token: string) {
    try {
      const decoded: UserData = jwtDecode(token);
      
      // Удаляем старую куку
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
      console.log("decoded.exp:", decoded.exp);
      const expiresDate = new Date(decoded.exp * 1000);
      console.log("expiresDate (UTC):", expiresDate.toUTCString()); 
      // Устанавливаем новую с валидацией
      setCookieWithValidation("token", token, {
        expires: new Date(decoded.exp * 1000),
        path: "/",
        secure: location.protocol === "https:"
      });
  
      this.setAuth(true, decoded);
      setAuthToken(token);
  
    } catch (error) {
      console.error("Ошибка установки куки:", error);
      // Дополнительная обработка (например, вывод уведомления)
    }
  }
  

  logout() {
   // localStorage.removeItem("token")
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    this.setAuth(false, null)
    setAuthToken("")
  }
}

class RootStore {
  authStore: AuthStore

  constructor() {
    this.authStore = new AuthStore()
  }
}

const rootStore = new RootStore()
export default rootStore

  



