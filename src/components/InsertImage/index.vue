<template>
    <!-- 插入时显示的按钮 -->
    <div class="insertPop" v-show="insertShow">
        <!-- 设置旋转角度 -->
        <el-popover placement="top-start" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <el-button slot="reference">设置角度</el-button>
            <div class="block">
                <el-slider v-model="imageParams.angle" :max="360" @input="changeAngle"></el-slider>
            </div>
        </el-popover>
        <!-- 设置时间 -->
        <el-dropdown @command="handleCommandTime">
            <el-button type="success">
                设置时间<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="start">起始时间</el-dropdown-item>
                <el-dropdown-item command="end">结束时间</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" @click="sureInsert">确认</el-button>
        <el-button @click="cancelInsert">取消</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            insertShow: false,
            imageParams: {   // 需要传递给贴图组件的图片参数
                position: '',
                startTime: -1,
                endTime: -1,
                angle: 0,
                size: '200,200',
            },
            currentUrl: '',
            ctx2: undefined
        }
    },
    props: ['video'],
    methods: {
        // 取消插入
        cancelInsert() {
            this.insertShow = false;
            this.$bus.$emit('shiftModalShow');
            this.$bus.$emit('cancelHighlight');
        },
        // 确认插入
        sureInsert() {
            this.cancelInsert();
            this.$bus.$emit('insertImage', JSON.parse(JSON.stringify(this.imageParams)));
        },
        // 设置开始、结束时间
        handleCommandTime(command) {
            if (command == 'end') {
                if (this.video.currentTime >= this.imageParams.startTime) {
                    this.imageParams.endTime = this.video.currentTime;
                    this.$message.success({
                        message: '结束时间设置成功',
                        duration: 1000
                    });
                } else {
                    this.$message.error({
                        message: '结束时间不能小于起始时间',
                        duration: 1000
                    });
                }
            } else {
                if (this.imageParams.endTime == -1 || this.video.currentTime <= this.imageParams.endTime) {
                    this.imageParams.startTime = this.video.currentTime;
                    this.$message.success({
                        message: '起始时间设置成功',
                        duration: 1000
                    });
                } else {
                    this.$message.error({
                        message: '起始时间不能大于结束时间',
                        duration: 1000
                    });
                }
            }
        },
        // 改变旋转角度
        changeAngle(newVal) {
            this.$bus.$emit('changeAngle', newVal);
        }
    },
    created() {
        this.$bus.$on('showInsert2', () => {
            this.insertShow = true;
        })
        this.$bus.$on('changePosition2', position => {
            this.imageParams.position = position;
        })
        this.$bus.$on('changeImageSize', size => {
            this.imageParams.size = size;
        })
    }
}
</script>

<style lang="scss" scoped>
// 插入的按钮框属性
.insertPop {
    position: absolute;
    top: 0;
    right: 20px;
    height: 60px;
    z-index: 1;
    line-height: 60px;

    .el-button {
        margin-left: 10px;
    }
}
</style>