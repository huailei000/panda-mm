export default {
    /*
    * 将数组扁平结构的数据转换成树结构数据
    * */
    treeConvert(rows) {
        function exists(rows, parentId) {
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].id == parentId) return true;
            }
            return false;
        }

        let nodes = [];
        // 获取顶点节点
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            if (!exists(rows, row.parentId)) {
                let {id, name, ...otherProps} = row;// 获取其他自定props
                nodes.push({
                    key: id,
                    title: name,
                    data: otherProps
                });
            }
        }

        let toDo = [];
        for (let i = 0; i < nodes.length; i++) {
            toDo.push(nodes[i]);
        }
        while (toDo.length) {
            let node = toDo.shift();// 父节点
            // 获取孩子节点
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                if (row.parentId === node.key) {
                    let {id, name, ...otherProps} = row;// 获取其他自定props
                    let child = {key: id, title: name, data: otherProps};
                    if (node.children) {
                        node.children.push(child);
                    } else {
                        node.children = [child];
                    }
                    toDo.push(child);
                }
            }
        }
        return nodes;
    }
};