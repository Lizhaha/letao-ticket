<template>
    <div class="login">
        <div class="left-img" v-if="!isVisitByPhone">
            <img src="../assets/images/loginImg.svg" alt="登录页">
        </div>
        <div class="right-form">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
                <el-form-item label="账号" prop="phoneNum">
                    <el-input v-model="ruleForm.phoneNum" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')" :loading="loginLoading">登录</el-button>
                    <router-link to="/register" class="jump-tip"><el-button>还没有账号？去注册</el-button></router-link>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {login} from '../service/index';
import { mapGetters } from 'vuex';
import tokenUtil from '../utils/token.js';
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
                    login({
                        phoneNum: this.ruleForm.phoneNum,
                        password: this.ruleForm.password
                    }).then((res) => {
                        console.log(res);
                        if (res.success) {
                            tokenUtil.setTokenToCookie(res.data);
                            this.$message.success('登录成功');
                            this.$router.replace({path: '/'});
                            this.$emit('check');
                        } else if (res.success === false && res.message.length) {
                            this.$message.error(res.message);
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
    },
    computed: {
        ...mapGetters([
            'isVisitByPhone'
        ]),
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
        padding: 20px 0;
    }
    .ruleForm {
        max-width: 500px;
        .jump-tip {
            margin-left: 12px;
        }
    }
}
</style>