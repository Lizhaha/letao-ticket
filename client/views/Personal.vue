<template>
    <div class="personal">
        <div class="left-avatar">
            <el-avatar shape="square" :size="200" icon="el-icon-user-solid" v-if="!(userInfo && userInfo.avatar)"></el-avatar>
            <el-avatar shape="square" :size="200" fit="fit" :src="imageUrl" v-else></el-avatar>
            <el-upload
                v-if="userInfo"
                ref="upload"
                class="avatar-uploader"
                :action="baseUrl + '/user/uploadAvatar'"
                :show-file-list="false"
                :on-change="handleAvatarChange"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :data="{'phoneNum': userInfo.phoneNum, 'userId': userInfo.userId}"
                :auto-upload="false">
                <el-button>上传图片</el-button>
            </el-upload>
        </div>
        <div class="right-message">
            <el-form v-if="userInfo" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号">
                    <span>{{userInfo.phoneNum}}</span>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-if="isEdit" v-model="ruleForm.userName" autocomplete="off"></el-input>
                    <span v-else>{{userInfo.userName}}</span>
                </el-form-item>
                <!-- <div v-if="isEdit">
                    <el-form-item label="密码" prop="pass">
                        <el-input type="password" v-if="isEdit" v-model="ruleForm.userName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="checkPass">
                        <el-input type="password" v-if="isEdit" v-model="ruleForm.userName" autocomplete="off"></el-input>
                    </el-form-item>
                </div> -->
                <el-form-item>
                    <div class="btn-group" v-if="isEdit">
                        <el-button type="primary" @click="operateForm('submit', 'ruleForm')">提交</el-button>
                        <el-button @click="isEdit = false;$refs['ruleForm'].resetFields();">取消</el-button>
                    </div>
                    <el-button v-else type="primary" @click="operateForm('edit')">编辑</el-button>
                </el-form-item>
            </el-form>
            <p v-else>正在加载数据...</p>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { editPersonalMsg } from '../service/index';
export default {
    data () {
        let getStrLen = (value) => {
            let regx = /[\u4e00-\u9fa5]/;
            let len = 0;
            for (let i = 0; i < value.length; i++) {
                if (regx.test(value[i])) {
                    len += 2;
                } else {
                    len += 1;
                }
            }
            return len;
        };
        let validateUserName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('用户名不可为空'));
            } else if (getStrLen(value) > 14) {
                callback(new Error('长度不可大于14!（中文长度为2）'));
            } else {
                callback();
            }
        };
        return {
            isEdit: false,
            ruleForm: {
                userName: ''
            },
            rules: {
                userName: [
                    { validator: validateUserName, trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'baseUrl'
        ]),
        imageUrl () {
            return this.userInfo && this.userInfo.avatar ? this.baseUrl + this.userInfo.avatar : '';
        }
    },
    methods: {
        ...mapActions([
            'setUserInfo'
        ]),
        handleAvatarSuccess(res) {
            let url = res.data.fileBase;
            let temp = JSON.parse(JSON.stringify(this.userInfo));
            temp.avatar = url;
            this.setUserInfo(temp);
        },
        handleAvatarChange (file) {
            if (file.status === 'ready') {
                this.$confirm(`<div style="text-align:center;"><img src=${URL.createObjectURL(file.raw)} style="width: 200px; height: auto;"></div>`, '确定要将头像修改为以下图片吗？', {
                    dangerouslyUseHTMLString: true
                })
                .then(() => {
                    this.$refs.upload.submit(); 
                }).catch(() => {
                    this.$refs.upload.abort();         
                });
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG / PNG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        operateForm(operate, formName) {
            if (operate === 'edit') {
                this.isEdit = true;
            } else {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        editPersonalMsg({
                            userId: this.userInfo.userId,
                            userName: this.ruleForm.userName
                        }).then((res) => {
                            if (res.success) {
                                this.isEdit = false;
                                this.$message.success('修改个人信息成功');
                                this.$emit('editSuccess');
                            } else {
                                this.$message.error(res.$message || '修改个人信息失败');
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
}
</script>

<style lang="scss">
.personal {
    display: flex;
    .left-avatar {
        width: 300px;
        text-align: center;
        .el-button {
            width: 200px;
            margin-top: 10px;
        }
    }
    .right-message {

    }
}
</style>