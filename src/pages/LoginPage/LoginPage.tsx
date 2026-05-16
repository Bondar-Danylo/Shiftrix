import styles from "./LoginPage.module.scss";
import emailIcon from "@/assets/icons/email_icon.svg";
import padlock from "@/assets/icons/padlock_icon.svg";
import eyeIcon from "@/assets/icons/eye_icon.svg";
import eyeOffIcon from "@/assets/icons/eye-off_icon.svg";
import Button from "@/components/Common/Button/Button";
import React, { useState } from "react";
import { Link, useNavigate, type NavigateFunction } from "react-router-dom";

const LoginPage = () => {
  const navigate: NavigateFunction = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter correct an email";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must have at least 6 symbols";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    setIsLoading(true);

    try {
      // 1. Имитация запроса к API
      console.log("Data sent:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 2. Имитируем получение токена и роли от сервера
      // Для теста: если в почте есть слово "admin", даем роль админа
      const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
      const role = formData.email.toLowerCase().includes("admin")
        ? "admin"
        : "user";

      // 3. Сохраняем данные для DashboardLayout и защиты роутов
      localStorage.setItem("userToken", fakeToken);
      localStorage.setItem("userRole", role);

      // 4. SPA редирект на главную страницу личного кабинета
      navigate("/");
    } catch (err) {
      // Обработка ошибок (например, если сервер вернул 401)
      setErrors({ general: "Incorrect password or email. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Link to={"/login"} className={styles.logo}>
          <img src="logo_text.png" alt="Shiftrix Logo" />
        </Link>

        <form onSubmit={handleSubmit} className={styles.auth}>
          {errors.general && (
            <div className={styles.errorSummary}>{errors.general}</div>
          )}

          <div
            className={`${styles.item} ${errors.email ? styles.itemError : ""}`}
          >
            <div className={styles.item__image}>
              <img
                src={emailIcon}
                alt="Email Icon"
                className={styles.item__icon}
              />
            </div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={styles.item__input}
              disabled={isLoading}
            />
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email}</span>
            )}
          </div>

          <div
            className={`${styles.item} ${errors.password ? styles.itemError : ""}`}
          >
            <div className={styles.item__image}>
              <img
                src={padlock}
                alt="Padlock Icon"
                className={styles.item__icon}
              />
            </div>
            <div className={styles.inputWrapper}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={styles.item__input}
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={togglePasswordVisibility}
              >
                <img
                  src={showPassword ? eyeOffIcon : eyeIcon}
                  alt="Toggle password visibility"
                />
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password}</span>
            )}
          </div>

          <div className={styles.buttonContainer}>
            <Button
              type="submit"
              size="large"
              isLink={false}
              disabled={isLoading}
              className={styles.submit__btn}
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
