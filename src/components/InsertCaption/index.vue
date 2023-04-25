<template>
    <!-- 插入时显示的按钮 -->
    <div class="insertPop" v-show="insertShow">
        <!-- 设置颜色 -->
        <el-color-picker v-model="textParams.fontColor"></el-color-picker>
        <!-- 设置字体 -->
        <el-select v-model="textParams.fontSize" placeholder="请选择" style="width: 80px;">
            <el-option v-for="item in 90" :key="item" :label="`${item}px`" :value="`${item}px`">
            </el-option>
        </el-select>
        <!-- 设置样式 -->
        <el-dropdown @command="handleCommandStyle" :hide-on-click="false">
            <el-button type="info">
                设置样式<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="italic"><el-checkbox
                        v-model="textParams.fontStyle.italic">斜体</el-checkbox></el-dropdown-item>
                <el-dropdown-item command="bold"><el-checkbox
                        v-model="textParams.fontStyle.bold">粗体</el-checkbox></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
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
            textParams: { // 需要传递给字幕组件的文本参数
                position: '',
                text: '',
                startTime: -1,
                endTime: -1,
                fontSize: '16px',
                fontColor: '#000',
                fontStyle: {
                    italic: false,
                    bold: false,
                }
            }
        }
    },
    props: ['video', 'input'],
    methods: {
        // 取消插入
        cancelInsert() {
            this.insertShow = false;
            this.$bus.$emit('shiftModalShow');
            this.$bus.$emit('cancelHighlight');
            this.input.style.visibility = 'hidden';
            this.$bus.$emit('resetInsertCaption');
        },
        // 确认插入
        sureInsert() {
            // 设置文本内容
            this.textParams.text = this.input.value;
            this.insertShow = false;
            this.$bus.$emit('shiftModalShow');
            this.$bus.$emit('cancelHighlight');
            this.input.style.visibility = 'hidden';
            this.$bus.$emit('insertCaption', JSON.parse(JSON.stringify(this.textParams)));
        },
        // 设置开始、结束时间
        handleCommandTime(command) {
            if (command == 'end') {
                if (this.video.currentTime >= this.textParams.startTime) {
                    this.textParams.endTime = this.video.currentTime;
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
                if (this.textParams.endTime == -1 || this.video.currentTime <= this.textParams.endTime) {
                    this.textParams.startTime = this.video.currentTime;
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
        // 设置字体样式
        handleCommandStyle(command) {
            switch (command) {
                case 'italic': this.$bus.$emit('changeFontStyle', 1, this.textParams.fontStyle.italic); break;
                case 'bold': this.$bus.$emit('changeFontStyle', 2, this.textParams.fontStyle.bold); break;
            }
        }
    },
    created() {
        this.$bus.$on('showInsert1', () => {
            this.insertShow = true;
        })
        this.$bus.$on('changePosition1', position => {
            this.textParams.position = position;
        })
        // 重置参数
        this.$bus.$on('resetInsertCaption', () => {
            this.textParams.fontSize = '16px';
            this.textParams.fontColor = '#000';
            this.textParams.position = '';
            this.textParams.text = '';
            this.textParams.startTime = -1;
            this.textParams.endTime = -1;
            this.textParams.fontStyle = {
                italic: false,
                bold: false,
            }
        })
    },
    computed: {
        // 对象的深拷贝,为了能够监听到变化
        textParams1() {
            return JSON.parse(JSON.stringify(this.textParams));
        }
    },
    watch: {
        textParams1: {
            handler(newVal, oldVal) {
                if (newVal.fontSize != oldVal.fontSize) {
                    this.$bus.$emit('changeFontSize', newVal.fontSize);
                }
                if (newVal.fontColor != oldVal.fontColor) {
                    this.$bus.$emit('changeFontColor', newVal.fontColor);
                }
            },
            deep: true
        },
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

    .el-color-picker {
        margin-right: 10px;
    }

    .el-button {
        margin-left: 10px;
    }
}
</style>