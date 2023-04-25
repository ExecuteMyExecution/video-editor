<template>
    <div>
        <!-- 导出数据的弹出框 -->
        <el-dialog title="数据接口" :visible.sync="dialogTableVisible" width="80%">
            <div class="exportDialog">
                <h3>字幕数据</h3>
                <el-table :data="captions" header-row-class-name="my-header" row-class-name="my-row">
                    <el-table-column prop="startTime" label="起始时间" >
                    </el-table-column>
                    <el-table-column prop="endTime" label="结束时间" >
                    </el-table-column>
                    <el-table-column prop="position" label="位置" >
                    </el-table-column>
                    <el-table-column prop="fontSize" label="字号" >
                    </el-table-column>
                    <el-table-column prop="fontColor" label="颜色" >
                    </el-table-column>
                    <el-table-column prop="content" label="内容">
                    </el-table-column>
                    <el-table-column prop="fontStyle.content" label="样式">
                    </el-table-column>
                </el-table>
                <h3>贴图数据</h3>
                <el-table :data="images" header-row-class-name="my-header" row-class-name="my-row">
                    <el-table-column prop="startTime" label="起始时间">
                    </el-table-column>
                    <el-table-column prop="endTime" label="结束时间">
                    </el-table-column>
                    <el-table-column prop="position" label="位置">
                    </el-table-column>
                    <el-table-column prop="size" label="大小">
                    </el-table-column>
                    <el-table-column prop="angle" label="角度">
                    </el-table-column>
                    <el-table-column label="内容">
                        <template slot-scope="scope">
                            <el-button type="mini" v-show="scope.row.content"
                                @click="handlePictureCardPreview(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!-- 预览图片展示 -->
        <el-dialog :visible.sync="dialogVisible" width="35%">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogTableVisible: false,
            dialogVisible: false,
            dialogImageUrl: '',
        }
    },
    props: ['captions', 'images'],
    created() {
        this.$bus.$on('changeDialogTableVisible', () => {
            this.dialogTableVisible = !this.dialogTableVisible;
        })
    },
    methods: {
        // 查看预览图片
        handlePictureCardPreview(row) {
            this.dialogImageUrl = row.content;
            this.dialogVisible = true;
        },
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
    background: #3B3B3B;

    .el-dialog__title {
        color: #fff;
    }

    .exportDialog {
        height: 60vh;
        overflow: scroll;

        h3 {
            color: #f1a119;
            margin: 0;
            padding: 1em 10px;
            border-bottom: 1px solid #fff;

            &:first-child {
                padding-top: 0;
            }
        }
    }
}

.el-table {
    color: #fff;
    background-color: #3b3b3b;

    ::v-deep .my-row {
        background: #3b3b3b;
    }

    &::before {
        height: 0;
    }

    ::v-deep .my-header th {
        color: #fff;
        background: #3b3b3b;
    }

    ::v-deep tbody tr:hover>td {
        background-color: #616060 !important;
    }
}
</style>