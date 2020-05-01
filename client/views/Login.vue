<template>
    <div class="login">
        <div class="left-img">
            <img src="../assets/images/loginImg.svg" alt="login页">
        </div>
        <div class="right-form">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号" prop="phoneNum">
                    <el-input v-model="ruleForm.phoneNum" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="passwordword" v-model="ruleForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')" :loading="loginLoading">登录</el-button>
                </el-form-item>
            </el-form>
            <router-link to="/register">还没有账号？去注册</router-link>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Util from '../utils/token.js';
export default {
    data () {
        var validatePhoneNum = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入账号'));
            } else if(!(/^1[3456789]\d{9}$/.test(value))) {
                callback('格式有误，请输入正确的手机号码');
            } else {
                callback();
            }
        };
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else if (value.length < 6 || value.length > 10) {
                callback(new Error('请6-10位的密码'));
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
        };
        return {
            ruleForm: {
                password: '',
                phoneNum: ''
            },
            rules: {
                phoneNum: [
                    { validator: validatePhoneNum, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ]
            },
            loginLoading: false
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loginLoading = true;
                    axios({
                        method: 'post',
                        url: 'http://127.0.0.1:8081/user/login',
                        data: {
                            phoneNum: this.ruleForm.phoneNum,
                            password: this.ruleForm.password
                        }     
                    }).then((res) => {
                        console.log(res);
                        let data = res.data;
                        if (data.success) {
                            Util.setTokenToCookie(data.data);
                            this.$message.success('登录成功');
                        } else if (data.success === false && data.message.length) {
                            this.$message.error(data.message);
                        } else {
                            this.$message.error('登录失败');
                        }
                    }).catch(() => {
                        this.$message.error('网络错误，请稍后重试');
                    }).finally(() => {
                        this.loginLoading = false;
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.login {
    display: flex;
    .left-img {
        flex: 1;
        img{
            width: 100%;
        }
    }
    .right-form {
        flex: 1;
        padding: 20px;
    }
}
</style>