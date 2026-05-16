import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  StatusBar, KeyboardAvoidingView, Platform, Alert, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext'; 

import { ACCOUNTS } from '../data/mockData';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // CẬP NHẬT 2: Thêm State quản lý lỗi hiển thị UI
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login } = useAuth();

  const handleLogin = () => {
    let isValid = true;

    // Reset lỗi
    setEmailError('');
    setPasswordError('');

    // Kiểm tra trống
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Vui lòng nhập email');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Định dạng email không hợp lệ');
      isValid = false;
    }

    // 3. Validate Mật khẩu
    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      isValid = false;
    }


    // Nếu có lỗi thì dừng lại
    if (!isValid) return;

    // Tìm tài khoản khớp email (hoặc handle) VÀ khớp mật khẩu
    const matchedUser = ACCOUNTS.find(
      (acc) => (acc.email === email.trim() || acc.handle === email.trim()) && acc.password === password
    );

    if (matchedUser) {
      const { password, ...safeUserData } = matchedUser;
      login(safeUserData); 
    } else {
      Alert.alert('Đăng nhập thất bại', 'Sai Email hoặc Mật khẩu. Vui lòng thử lại!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/unnamed.png')} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Chào mừng trở lại</Text>
            <Text style={styles.subText}>Đăng nhập để tiếp tục đọc truyện</Text>
          </View>

          <View style={styles.formContainer}>
            
            {/* INPUT EMAIL / TÊN ĐĂNG NHẬP */}
            <View style={styles.inputWrapper}>
              <View style={[styles.inputGroup, emailError ? styles.inputErrorBorder : null]}>
                <Ionicons name="mail-outline" size={20} color={emailError ? "#FF4D4D" : "#A0A0A0"} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email hoặc tên đăng nhập"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError(''); // Tự xóa lỗi khi gõ lại
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            {/* INPUT MẬT KHẨU */}
            <View style={styles.inputWrapper}>
              <View style={[styles.inputGroup, passwordError ? styles.inputErrorBorder : null]}>
                <Ionicons name="lock-closed-outline" size={20} color={passwordError ? "#FF4D4D" : "#A0A0A0"} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError('');
                  }}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#A0A0A0" />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>Đăng Nhập</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Bạn chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  keyboardView: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoImage: { width: 140, height: 50, marginBottom: 20 }, 
  welcomeText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subText: { color: '#A0A0A0', fontSize: 14 },
  formContainer: { marginBottom: 24 },
  
  // Đồng bộ Style báo lỗi với màn hình Đăng ký
  inputWrapper: { marginBottom: 16 }, 
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#222', borderRadius: 12, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#333' },
  inputErrorBorder: { borderColor: '#FF4D4D', backgroundColor: 'rgba(255, 77, 77, 0.05)' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  eyeIcon: { padding: 4 },
  errorText: { color: '#FF4D4D', fontSize: 13, marginTop: 6, marginLeft: 4 },

  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { color: '#FF500A', fontSize: 14, fontWeight: '500' },
  primaryButton: { backgroundColor: '#FF500A', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#FF500A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#A0A0A0', fontSize: 14 },
  linkText: { color: '#FF500A', fontSize: 14, fontWeight: 'bold' },
});

export default LoginScreen;