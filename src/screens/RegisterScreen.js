import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  StatusBar, KeyboardAvoidingView, Platform, ScrollView, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext'; 

const RegisterScreen = ({ navigation }) => {
  // States cho dữ liệu nhập
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // States cho thông báo lỗi từng trường
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login } = useAuth();

  const handleRegister = () => {
    let isValid = true;

    // Reset lại toàn bộ lỗi trước khi kiểm tra
    setUsernameError('');
    setEmailError('');
    setPasswordError('');

    // 1. Validate Tên hiển thị
    if (!username.trim()) {
      setUsernameError('Vui lòng nhập tên hiển thị');
      isValid = false;
    } else if (username.trim().length < 3) {
      setUsernameError('Tên hiển thị phải có ít nhất 3 ký tự');
      isValid = false;
    }

    // 2. Validate Email (Dùng Regex cơ bản)
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

    // Nếu có bất kỳ lỗi nào thì dừng lại
    if (!isValid) return;

    // Đã pass toàn bộ validate -> Tiến hành đăng nhập
    const newUser = {
      id: 'new_user_' + Math.floor(Math.random() * 1000),
      username: username.trim(),
      email: email.trim(),
      avatar: 'logo', 
    };

    login(newUser);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#FFF" />
      </TouchableOpacity> */}

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.headerContainer}>
            <Image 
              source={require('../../assets/images/unnamed.png')} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
            <Text style={styles.title}>Tạo Tài Khoản</Text>
            <Text style={styles.subText}>Tham gia cộng đồng và khám phá hàng ngàn truyện hấp dẫn.</Text>
          </View>

          <View style={styles.formContainer}>
            
            {/* INPUT TÊN HIỂN THỊ */}
            <View style={styles.inputWrapper}>
              <View style={[styles.inputGroup, usernameError ? styles.inputErrorBorder : null]}>
                <Ionicons name="person-outline" size={20} color={usernameError ? "#FF4D4D" : "#A0A0A0"} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Tên hiển thị"
                  placeholderTextColor="#666"
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (usernameError) setUsernameError(''); // Tự xóa lỗi khi người dùng gõ lại
                  }}
                />
              </View>
              {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
            </View>

            {/* INPUT EMAIL */}
            <View style={styles.inputWrapper}>
              <View style={[styles.inputGroup, emailError ? styles.inputErrorBorder : null]}>
                <Ionicons name="mail-outline" size={20} color={emailError ? "#FF4D4D" : "#A0A0A0"} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
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

            <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
              <Text style={styles.primaryButtonText}>Đăng Ký</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.linkText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  backButton: { padding: 16, position: 'absolute', zIndex: 10 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  headerContainer: { marginBottom: 40, alignItems: 'center' },
  logoImage: { width: 48, height: 48, marginBottom: 16 },
  title: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  subText: { color: '#A0A0A0', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  formContainer: { marginBottom: 24 },
  
  // Container bọc ngoài ô nhập và dòng báo lỗi
  inputWrapper: { marginBottom: 16 }, 
  // Bỏ marginBottom cũ ở inputGroup vì đã chuyển sang inputWrapper
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#222', borderRadius: 12, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: '#333' },
  // Đổi viền thành đỏ nếu có lỗi
  inputErrorBorder: { borderColor: '#FF4D4D', backgroundColor: 'rgba(255, 77, 77, 0.05)' },
  
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  eyeIcon: { padding: 4 },
  
  // Style cho dòng chữ báo lỗi
  errorText: { color: '#FF4D4D', fontSize: 13, marginTop: 6, marginLeft: 4 },
  
  primaryButton: { backgroundColor: '#FF500A', height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  footerText: { color: '#A0A0A0', fontSize: 14 },
  linkText: { color: '#FF500A', fontSize: 14, fontWeight: 'bold' },
});

export default RegisterScreen;