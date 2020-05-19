<template>
    <div class="register">
        <div class="left-img" v-if="!isVisitByPhone">
            <img src="../assets/images/loginImg.svg" alt="注册页">
        </div>
        <div class="right-form">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
                <el-form-item label="账号" prop="phoneNum">
                    <el-input v-model="ruleForm.phoneNum" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')" :loading="registerLoading">注册</el-button>
                    <router-link to="/login" class="jump-tip"><el-button>已有账号？去登录</el-button></router-link>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import {register} from '../service/index';
import { mapGetters } from 'vuex';
export default {
    data () {
        var validateAccount = (rule, value, callback) => {
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
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.password) {
                callback(new Error('两次输入的密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                password: '',
                checkPass: '',
                phoneNum: ''
            },
            rules: {
                phoneNum: [
                    { validator: validateAccount, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ]
            },
            registerLoading: false
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.registerLoading = true;
                    register({
                        phoneNum: this.ruleForm.phoneNum,
                        password: this.ruleForm.password
                    }).then((res) => {
                        if (res.success) {
                            this.$message.success('注册成功');
                            this.$router.push({path: '/login'});
                        } else if (res.success === false && res.message.length) {
                            this.$message.error(res.message);
                        } else {
                            this.$message.error('注册失败');
                        }
                    }).catch(() => {
                        this.$message.error('网络错误，请稍后重试');
                    }).finally(() => {
                        this.registerLoading = false;
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
.register {
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