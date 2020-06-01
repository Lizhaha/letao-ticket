<template>
    <div class="manage">
        <el-row v-if="userInfo && userInfo.isRoot">
            <el-col :span="4" class="left-menu">
                <el-menu
                :default-active="activeIndex"
                class="el-menu-vertical-demo"
                @select="handleSelect"
                :collapse="isCollapse">
                    <el-menu-item index="1">
                        <i class="el-icon-user-solid"></i>
                        <span slot="title">用户管理</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <i class="el-icon-menu"></i>
                        <span slot="title">影片管理</span>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <i class="el-icon-s-shop"></i>
                        <span slot="title">放映厅管理</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <i class="el-icon-video-camera-solid"></i>
                        <span slot="title">放映场次管理</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="20" class="right-content">
                <!-- 操作 -->
                <div class="operate">
                    <el-button @click="handleAdd">添加</el-button>
                    <div class="search">
                        <el-input
                            v-if="activeIndex === '1' || activeIndex === '2'"
                            :placeholder="activeIndex === '1' ? '请输入用户账号/用户名进行搜索' : '请输入影片名称进行搜索'"
                            prefix-icon="el-icon-search"
                            v-model="searchValue"
                            @input="handleSearchInput">
                        </el-input>
                        <div ref="result" class="result" v-show="isShowResult">
                            <div
                                v-for="item in searchResult"
                                :key="activeIndex === '1' ? item.userId : item.movieId"
                                @click="handleChoose">
                                <span>{{activeIndex === '1' ? item.phoneNum+'：'+item.userName : item.movieName}}</span>
                            </div>
                        </div>
                    </div>
                    <el-select
                        v-if="activeIndex === '4'"
                        v-model="selectedMovie"
                        filterable
                        placeholder="请选择要查看的电影"
                        @change="handleSelectedChange">
                        <el-option
                        v-for="item in tableData.movie"
                        :key="item.movieId"
                        :label="item.movieName"
                        :value="item.movieId">
                        </el-option>
                    </el-select>
                </div>
                <!-- 用户 -->
                <el-table v-if="activeIndex === '1'" :data="tableData.user" class="table-data">
                    <el-table-column
                        prop="userId"
                        label="用户id">
                    </el-table-column>
                    <el-table-column
                        prop="phoneNum"
                        label="账号">
                    </el-table-column>
                    <el-table-column
                        label="用户名">
                        <template slot-scope="scope">
                            <span>{{scope.row.userName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="头像">
                        <template slot-scope="scope">
                            <span v-if="!(scope.row.avatar && scope.row.avatar.length)">无</span>
                            <el-avatar shape="square" :size="50" fit="fit" :src="baseUrl+scope.row.avatar" v-else></el-avatar>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="是否管理员">
                        <template slot-scope="scope">
                            <el-switch
                                slot="reference"
                                @change="handleRoleChange(scope.row)"
                                v-model="scope.row.isRoot"
                                active-text="管理员"
                                inactive-text="普通用户">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <el-button @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 影片 -->
                <el-table v-if="activeIndex === '2'" :data="tableData.movie" class="table-data">
                    <el-table-column
                        width="65"
                        prop="movieId"
                        label="影片id">
                    </el-table-column>
                    <el-table-column
                        width="100"
                        show-overflow-tooltip
                        prop="movieName"
                        label="影片名称">
                    </el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        label="影片简介">
                        <template slot-scope="scope">
                            <span>{{scope.row.introduction}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        label="上映时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.releaseTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="时长">
                        <template slot-scope="scope">
                            <span>{{scope.row.timeLength}}分钟</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        label="类型">
                        <template slot-scope="scope">
                            <span>{{scope.row.movieType}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        prop="director"
                        label="导演">
                    </el-table-column>
                    <el-table-column
                        show-overflow-tooltip
                        prop="mainActor"
                        label="演员">
                    </el-table-column>
                    <el-table-column label="海报">
                        <template slot-scope="scope">
                            <span v-if="!(scope.row.imgUrl && scope.row.imgUrl.length)">无</span>
                            <img width="50" :src="baseUrl+scope.row.imgUrl" v-else />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-button size="mini" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 放映厅 -->
                <el-table v-if="activeIndex === '3'" :data="tableData.room" class="table-data">
                    <el-table-column
                        prop="roomId"
                        label="放映厅">
                    </el-table-column>
                    <el-table-column
                        prop="roomName"
                        label="放映厅名称">
                    </el-table-column>
                    <el-table-column
                        label="规格">
                        <template slot-scope="scope">
                            <span>{{scope.row.row}}排{{scope.row.column}}列</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="非座位位置">
                        <template slot-scope="scope">
                            <span>{{scope.row.emptySeats || '无'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <el-button @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 场次信息 -->
                <el-table v-if="activeIndex === '4'" :data="tableData.schedule" class="table-data">
                    <el-table-column
                        prop="scheduleId"
                        label="场次id">
                    </el-table-column>
                    <el-table-column
                        prop="movieName"
                        label="电影名称">
                    </el-table-column>
                    <el-table-column
                        label="放映厅">
                        <template slot-scope="scope">
                            <span>{{scope.row.roomName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="200"
                        label="放映时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.startTime}} - {{scope.row.endTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="语言版本">
                        <template slot-scope="scope">
                            <span>{{scope.row.langVersion}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="价格">
                        <template slot-scope="scope">
                            <span>{{scope.row.price}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <el-button @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <Empty :emptyType="emptyType" v-else></Empty>
        <!-- 添加用户 -->
        <el-dialog title="添加用户" :visible.sync="formVisible.user">
            <el-form :model="userForm" status-icon :rules="rules" ref="userForm" label-width="100px">
                <el-form-item label="账号" prop="phoneNum">
                    <el-input v-model="userForm.phoneNum" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="userForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="userForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="formVisible.user = false;$refs.userForm.resetFields()">取 消</el-button>
                <el-button type="primary" :loading="addLoading" @click="handleSubmitAdd">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加影片 -->
        <el-dialog
            class="add-dialog"
            title="添加影片"
            :visible.sync="formVisible.movie"
            @close="isEdit=false;editRow=null;submitUrl='/movie/addMovie'">
            <div class="add-movie">
                <div class="left">
                    <el-upload
                        ref="movieUpload"
                        class="avatar-uploader"
                        :action="baseUrl + submitUrl"
                        :show-file-list="false"
                        :on-change="handleAvatarChange"
                        :on-success="handleAddMovieSuccess"
                        :before-upload="beforeAvatarUpload"
                        :data="movieData"
                        :auto-upload="false">
                        <img v-if="posterImg" :src="posterImg" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <div class="right">
                    <el-form :model="movieForm" ref="movieForm" status-icon label-width="100px">
                        <el-form-item label="影片名称" prop="movieName">
                            <el-input v-model="movieForm.movieName" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="影片简介" prop="introduction">
                            <el-input type="textarea" v-model="movieForm.introduction" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="上映时间" prop="releaseTime">
                            <el-date-picker
                                v-model="movieForm.releaseTime"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="类型" prop="movieType">
                            <el-input v-model="movieForm.movieType" autocomplete="off"></el-input>
                            <span class="tip">有多个类型，请用','分割</span>
                        </el-form-item>
                        <el-form-item label="时长" prop="timeLength">
                            <el-input v-model="movieForm.timeLength" autocomplete="off"></el-input>
                            <span class="tip">单位：分钟</span>
                        </el-form-item>
                        <el-form-item label="导演" prop="director">
                            <el-input v-model="movieForm.director" autocomplete="off"></el-input>
                            <span class="tip">有多个导演，请用','分割</span>
                        </el-form-item>
                        <el-form-item label="主演" prop="mainActor">
                            <el-input v-model="movieForm.mainActor" autocomplete="off"></el-input>
                            <span class="tip">有多个主演，请用','分割</span>
                        </el-form-item>
                        <el-form-item label="所属地区" prop="region">
                            <el-input v-model="movieForm.region" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancelAdd">取 消</el-button>
                <el-button type="primary" :loading="addLoading" @click="handleSubmitAdd">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加放映厅 -->
        <el-dialog title="添加放映厅" :visible.sync="formVisible.room">
            <el-form :model="roomForm" status-icon :rules="rules" ref="roomForm" label-width="100px">
                <el-form-item label="放映厅名称" prop="roomName">
                    <el-input v-model="roomForm.roomName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="排" prop="row">
                    <el-input v-model="roomForm.row" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="列" prop="column">
                    <el-input v-model="roomForm.column" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="非座位" prop="emptySeats">
                    <el-input v-model="roomForm.emptySeats" autocomplete="off"></el-input>
                    <span class="tip">格式如：5-7，多个请用','分割</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="formVisible.room = false;$refs.roomForm.resetFields()">取 消</el-button>
                <el-button type="primary" :loading="addLoading" @click="handleSubmitAdd">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加放映场次 -->
        <el-dialog title="添加放映场次" :visible.sync="formVisible.schedule">
            <el-form :model="scheduleForm" status-icon :rules="rules" ref="scheduleForm" label-width="100px">
                <el-form-item label="影片名称" prop="movieId">
                    <el-select v-model="scheduleForm.movieId" filterable placeholder="请选择">
                        <el-option
                            v-for="item in tableData.movie"
                            :key="item.movieId"
                            :label="item.movieName"
                            :value="item.movieId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始放映时间" prop="startTime">
                    <el-date-picker
                        v-model="scheduleForm.startTime"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                    <span class="tip" style="margin-left: 10px">结束放映时间根据影片时长自动计算</span>
                </el-form-item>
                <el-form-item label="语言版本" prop="langVersion">
                    <el-input v-model="scheduleForm.langVersion" autocomplete="off" placeholder="请输入语言版本，如国语"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="emptySeats">
                    <el-input v-model="scheduleForm.price" autocomplete="off" placeholder="请输入电影票价格"></el-input>
                </el-form-item>
                <el-form-item label="放映厅" prop="roomId">
                    <el-select v-model="scheduleForm.roomId" placeholder="请选择">
                        <el-option
                            v-for="item in tableData.room"
                            :key="item.roomName"
                            :label="item.roomName"
                            :value="item.roomId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="formVisible.schedule = false;$refs.scheduleForm.resetFields()">取 消</el-button>
                <el-button type="primary" :loading="addLoading" @click="handleSubmitAdd">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import {
    allUser,
    allMovie,
    allRoom,
    allSchedule,
    changeRole,
    deleteUser,
    deleteMovie,
    deleteRoom,
    deleteSchedule,
    register,
    addOperate,
    editMovie
} from '../service/index';
import Empty from '../components/Empty.vue';
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
                if (this.userForm.checkPass !== '') {
                    this.$refs.userForm.validateField('checkPass');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.userForm.password) {
                callback(new Error('两次输入的密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            emptyType: 'unauthorized',
            isCollapse: false,
            activeIndex: '1',
            tableData: {
                user: [],
                movie: [],
                room: [],
                schedule: []
            },
            searchValue: '',
            selectedMovie: '',
            isShowResult: false,
            searchResult: null,
            formVisible: {
                user: false,
                movie: false,
                room: false,
                schedule: false
            },
            userForm: {
                password: '',
                checkPass: '',
                phoneNum: ''
            },
            movieForm: {
                movieName: '',
                introduction: '',
                releaseTime: '',
                movieType: '',
                timeLength: '',
                director: '',
                mainActor: '',
                region: ''
            },
            roomForm: {
                roomName: '',
                row: null,
                column: null,
                emptySeats: ''
            },
            scheduleForm: {
                movieId: null,
                startTime: '',
                endTime: '',
                langVersion: '',
                price: null,
                roomId: null
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
            addLoading: false,
            posterImg: null,
            isEdit: false,
            editRow: null,
            submitUrl: '/movie/addMovie'
        }
    },
    components: {
        Empty
    },
    mounted () {
        console.log('执行');
        this.getAllMessage(allUser, 'user');
        document.addEventListener('click', ()=>{
            this.isShowResult = false;
        }, false);
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'baseUrl'
        ]),
        movieData () {
            return {
                movieName: this.movieForm.movieName,
                introduction: this.movieForm.introduction,
                releaseTime: moment(this.movieForm.releaseTime).format('YYYY-MM-DD'),
                movieType: this.movieForm.movieType,
                timeLength: +this.movieForm.timeLength,
                director: this.movieForm.director,
                mainActor: this.movieForm.mainActor,
                region: this.movieForm.region
            };
        }
    },
    methods: {
        handleSelect (val) {
            console.log(val);
            this.activeIndex = val;
        },
        getAllMessage (callback, objName, otherCallback) {
            if (this.userInfo) {
                callback().then((res) => {
                    if (res.success) {
                        this.tableData[objName] = res.data
                        if (otherCallback) otherCallback();
                    }
                });
            }
        },
        handleRoleChange (row) {
            changeRole({
                userId: row.userId,
                isRoot: row.isRoot
            }).then((res) => {
                if (res.success) {
                    console.log(res.message);
                } else {
                    row.isRoot = !row.isRoot;
                }
            }).catch((e) => {
                console.log(e);
                row.isRoot = !row.isRoot;
            })
        },
        handleDelete (row) {
            let tipContent = '';
            let callback = null;
            let params = null;
            switch (this.activeIndex) {
                case '1':
                    tipContent = `确认要删除用户“${row.userName}”吗？`;
                    callback = deleteUser;
                    params = {
                        userId: row.userId
                    }
                    break;
                case '2':
                    tipContent = `确认要删除影片“${row.movieName}”吗？`;
                    callback = deleteMovie;
                    params = {
                        movieId: row.movieId
                    }
                    break;
                case '3':
                    tipContent = `确认要删除放映厅“${row.roomName}”吗？`;
                    callback = deleteRoom;
                    params = {
                        roomId: row.roomId
                    }
                    break;
                case '4':
                    tipContent = `确认要删除场次id为${row.scheduleId}场次吗？`;
                    callback = deleteSchedule;
                    params = {
                        scheduleId: row.scheduleId
                    }
                    break;
                default:
                    break;
            }
            this.$confirm(tipContent, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })
            .then(() => {
                callback(params)
                .then((res) => {
                    if (res.success) {
                        this.$message.success('删除成功');
                        this.getAll(this.activeIndex);
                    } else {
                        this.$message.error(res.message || '删除失败');
                    }
                })
            })
            .catch(() => {
                console.log('点击取消');
            });
        },
        handleAdd () {
            switch (this.activeIndex) {
                case '1':
                    this.formVisible.user = true;
                    break;
                case '2':
                    this.formVisible.movie = true;
                    break;
                case '3':
                    this.formVisible.room = true;
                    break;
                case '4':
                    this.formVisible.schedule = true;
                    this.getAllMessage(allRoom, 'room');
                    this.getAllMessage(allMovie, 'movie');
                    break;
                default:
                    break;
            }
        },
        getAll (index, otherCallback) {
            switch (index) {
                case '1':
                    this.getAllMessage(allUser, 'user');
                    break;
                case '2':
                    this.getAllMessage(allMovie, 'movie');
                    break;
                case '3':
                    this.getAllMessage(allRoom, 'room');
                    break;
                case '4':
                    otherCallback ? this.getAllMessage(allSchedule, 'schedule', otherCallback) : this.getAllMessage(allSchedule, 'schedule');
                    this.getAllMessage(allMovie, 'movie');
                    break;
                default:
                    break;
            }
        },
        handleSearchInput (val) {
            let searchFn = null;
            if (this.activeIndex === '1') {
                searchFn = allUser;
            } else {
                searchFn = allMovie;
            }searchFn
            if (val) {
                this.inputTimer = setTimeout(() => {
                    clearTimeout(this.inputTimer);
                    searchFn({
                        params: {
                            searchValue: val
                        }
                    }).then((res) => {
                        if (res.success) {
                            this.searchResult = res.data;
                            this.isShowResult = res.data.length ? true : false;
                        } else {
                            this.$message.error(res.message || '搜索失败');
                        }
                    });
                }, 1000);
            } else {
                this.isShowResult = false;
                this.activeIndex === '1' ? this.getAllMessage(allUser, 'user') : this.getAllMessage(allMovie, 'movie');

            }
        },
        handleSelectedChange (movieId) {
            this.getAll (this.activeIndex, () => {
                this.tableData.schedule = this.tableData.schedule.filter((schedule) => {
                    return schedule.movieId === movieId;
                })
            });
        },
        handleChoose () {
            this.isShowResult = false;
            if (this.activeIndex === '1') {
                this.tableData.user = this.searchResult;
            } else {
                this.tableData.movie = this.searchResult;
            }
        },
        handleCancelAdd () {
            this.formVisible.movie = false;
            this.$refs.movieForm.resetFields();
            this.$refs.movieUpload.abort(); 
            this.posterImg = '';
        },
        handleSubmitAdd () {
            switch (this.activeIndex) {
                case '1':
                    this.addLoading = true;
                    register({
                        phoneNum: this.userForm.phoneNum,
                        password: this.userForm.password
                    }).then((res) => {
                        if (res.success) {
                            this.$message.success('添加成功');
                            this.formVisible.user = false;
                            this.$refs.userForm.resetFields();
                            this.getAll(this.activeIndex);
                        } else {
                            this.$message.error('添加失败');
                        }
                    }).catch(() => {
                        this.$message.error('网络错误，请稍后重试');
                    }).finally(() => {
                        this.addLoading = false;
                    });
                    break;
                case '2':
                    console.log(this.$refs.movieUpload.uploadFiles.length);
                    if (!this.isEdit) {
                        if (this.$refs.movieUpload.uploadFiles.length) {
                            this.$refs.movieUpload.submit();
                        } else {
                            this.$message.warning('请上传影片的海报！');
                        }
                    } else {
                        if (this.$refs.movieUpload.uploadFiles.length && this.$refs.movieUpload.uploadFiles[0].status !== 'success') {
                            this.$refs.movieUpload.data.movieId = this.editRow.movieId;
                            this.$refs.movieUpload.submit();
                            console.log(this.$refs.movieUpload);
                        } else {
                            this.movieForm.type = 'noUpload';
                            editMovie(this.movieForm)
                            .then(res => {
                                if (res.success) {
                                    this.$message.success('编辑成功');
                                    this.formVisible.movie = false;
                                    this.getAll(this.activeIndex);
                                } else {
                                    this.$message.error('编辑失败');
                                }
                            });
                        }
                    }
                    break;
                case '3':
                    this.addLoading = true;
                    addOperate({
                        type: 'room',
                        roomName: this.roomForm.roomName,
                        row: +this.roomForm.row,
                        column: +this.roomForm.column,
                        emptySeats: this.roomForm.emptySeats,
                    }).then((res) => {
                        if (res.success) {
                            this.$message.success('添加成功');
                            this.formVisible.room = false;
                            this.$refs.roomForm.resetFields();
                            this.getAll(this.activeIndex);
                        } else {
                            this.$message.error('添加失败');
                        }
                    }).catch(() => {
                        this.$message.error('网络错误，请稍后重试');
                    }).finally(() => {
                        this.addLoading = false;
                    });
                    break;
                case '4':
                    this.scheduleForm.endTime = moment(this.scheduleForm.startTime).add('minutes', this.tableData.movie.find(item=>item.movieId===this.scheduleForm.movieId).timeLength);
                    this.addLoading = true;
                    addOperate({
                        type: 'schedule',
                        movieId: this.scheduleForm.movieId,
                        startTime: moment(this.scheduleForm.startTime).format('YYYY-MM-DD HH:mm:ss'),
                        endTime: moment(this.scheduleForm.endTime).format('YYYY-MM-DD HH:mm:ss'),
                        langVersion: this.scheduleForm.langVersion,
                        price: +this.scheduleForm.price,
                        roomId: this.scheduleForm.roomId,
                    }).then((res) => {
                        if (res.success) {
                            this.$message.success('添加成功');
                            this.formVisible.schedule = false;
                            this.$refs.scheduleForm.resetFields();
                            this.getAll(this.activeIndex);
                        } else {
                            this.$message.error('添加失败');
                        }
                    }).catch(() => {
                        this.$message.error('网络错误，请稍后重试');
                    }).finally(() => {
                        this.addLoading = false;
                    });
                    break;
                default:
                    break;
            }
        },
        handleAddMovieSuccess (res) {
            if (res.success) {
                this.$message.success(this.isEdit ? '编辑成功' : '添加成功');
                this.formVisible.movie = false;
                this.$refs.movieForm.resetFields();
                this.posterImg = '';
                this.getAll(this.activeIndex);
            } else {
                this.$message.error('添加失败');
            }
            this.addLoading = false;
        },
        handleAvatarChange (file) {
            if (file.status === 'ready') {
                this.posterImg = URL.createObjectURL(file.raw);
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            // const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传海报图片只能是 JPG / PNG 格式!');
            }
            // if (!isLt2M) {
            //     this.$message.error('上传海报图片大小不能超过 2MB!');
            // }
            // return isJPG && isLt2M;
            return isJPG;
        },
        handleEdit(row) {
            this.submitUrl = '/movie/editMovie';
            this.isEdit = true;
            this.editRow = row;
            this.movieForm = row;
            this.formVisible.movie = true;
            this.posterImg = this.baseUrl + row.imgUrl;
        }
    },
    watch: {
        'activeIndex': {
            handler (newIdx, oldIdx) {
                this.searchValue = '';
                this.selectedMovie = '';
                if (oldIdx) {
                    this.getAll(newIdx);
                }
            },
            immediate: true
        }
    }
}
</script>

<style lang="scss" >
.manage {
    .right-content {
        padding-left: 20px;
        box-sizing: border-box;
        .operate {
            .el-input {
                width: auto;
            }
            .el-select {
                margin-left: 10px;
            }
            .search {
                margin-left: 10px;
                display: inline-block;
                position: relative;
                .result {
                    width: 100%;
                    z-index: 10000;
                    position: absolute;
                    top: 44px;
                    left: 0;
                    background: #fff;
                    padding: 0 10px;
                    border: 1px solid #DCDFE6;
                    font-size: 14px;
                    box-sizing: border-box;
                    div {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        align-items: center;
                        cursor: pointer;
                        line-height: 40px;
                        border-bottom: 1px solid #eee;
                    }
                    div:last-of-type {
                        border-bottom: none;
                    }
                }
            }
        }
        .table-data {
            width: 100%;
            margin-top: 20px;
        }
    }
    .add-dialog {
        .add-movie {
            display: flex;
            .left {
                width: 178px;
                .avatar-uploader .el-upload {
                    border: 1px dashed #d9d9d9;
                    border-radius: 6px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }
                .avatar-uploader .el-upload:hover {
                    border-color: #409EFF;
                }
                .avatar-uploader-icon {
                    font-size: 28px;
                    color: #8c939d;
                    width: 178px;
                    height: 178px;
                    line-height: 178px;
                    text-align: center;
                }
                .avatar {
                    width: 178px;
                    // height: 178px;
                    display: block;
                }
            }
        }
    }
    .tip {
        color: #EA5D41;
    }
}
</style>