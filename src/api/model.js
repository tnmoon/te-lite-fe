import request from '../plugin/axios'
import * as THREE from 'three'

export async function getModelList() {
  return request({
    method: 'post',
    url: '/manager/get_data',
    data: {
      type: 'get_not_empty_models_list'
    }
  })
}

export async function getModelGridsList(name) {
  return request({
    method: 'post',
    url: '/manager/get_data',
    data: {
      type: 'get_model_grids_list',
      name,
    }
  })
}

// export async function getGridSizeInfo(names) {
//   let result = await request({
//     method: 'post',
//     url: '/manager/get_data',
//     data: {
//       type: 'get_grids_data_size_info',
//       names
//     }
//   })
//   let infos = []
//   result.forEach(element => {
//     infos.push({
//       byteSize: element['Grid_Info:Grid_Data_Size_Info'].byteSize,
//       cellNum: element['Grid_Info:Grid_Data_Size_Info'].cellNum
//     })
//   });
//   return infos
// }

export async function getGridSizeInfo(name) {
  let result = await request({
    method: 'post',
    url: '/manager/get_data',
    data: {
      type: 'get_grid_data_size_info',
      name
    }
  })

  return {
    byteSize: result['Grid_Info:Grid_Data_Size_Info'].byteSize,
    cellNum: result['Grid_Info:Grid_Data_Size_Info'].cellNum
  }
}

export async function getModelInfo(name) {
  let result = await request({
    method: 'post',
    url: '/manager/get_data',
    data: {
      type: 'get_grid_blocks_list',
      name
    }
  })
  let boundingBoxMin = new THREE.Vector3(
    result.bounding_box.Min.x,
    result.bounding_box.Min.y,
    result.bounding_box.Min.z
  )
  let boundingBoxMax = new THREE.Vector3(
    result.bounding_box.Max.x,
    result.bounding_box.Max.y,
    result.bounding_box.Max.z
  )
  let boundingBox = new THREE.Box3(
    boundingBoxMin,
    boundingBoxMax
  )
  return {
    blockList: result.blocks_list,
    boundingBox
  }
}

export async function getBlockData(name) {
  let blockData = await request({
    method: 'post',
    url: '/manager/get_data',
    data: {
      type: 'get_block_geom',
      name
    }
  })

  function constructArray(arraySource, arrayDestination) {
    for (let i = 0; i < arraySource.length; i++) {
      arrayDestination[i] = arraySource[i]
    }
  }

  let i = new Uint16Array(blockData['Block_Geom:I'].length)
  let j = new Uint16Array(blockData['Block_Geom:J'].length)
  let k = new Uint16Array(blockData['Block_Geom:K'].length)
  let cellFaceNum = new Uint32Array(blockData['Block_Geom:cell_faces_num'].length)
  let cellFaceIndex = new Uint32Array(blockData['Block_Geom:cell_faces_indices'].length)
  let cellFaceIndexOffset = new Uint32Array(blockData['Block_Geom:cell_faces_indices_offset'].length)
  let faceVerticeNum = new Uint32Array(blockData['Block_Geom:face_vertices_num'].length)
  let faceVerticeIndex = new Uint32Array(blockData['Block_Geom:face_vertices_indices'].length)
  let faceVerticeIndexOffset = new Uint32Array(blockData['Block_Geom:face_vertices_indices_offset'].length)
  let vertice = new Float32Array(blockData['Block_Geom:vertices'].length)
  let faceDirectionPerCell = new Uint8Array(blockData['Block_Geom:faces_directions_per_cell'].length)
  let cellZoneIdx = new Uint16Array(blockData['Block_Geom:cell_zoneidx'].length)
  let faceTypeTypeIid = new Uint8Array(blockData['Block_Geom:typeiid_per_face'].length)

  constructArray(blockData['Block_Geom:vertices'], vertice)
  constructArray(blockData['Block_Geom:face_vertices_num'], faceVerticeNum)
  constructArray(blockData['Block_Geom:face_vertices_indices'], faceVerticeIndex)
  constructArray(blockData['Block_Geom:face_vertices_indices_offset'], faceVerticeIndexOffset)
  constructArray(blockData['Block_Geom:cell_faces_num'], cellFaceNum)
  constructArray(blockData['Block_Geom:cell_faces_indices'], cellFaceIndex)
  constructArray(blockData['Block_Geom:cell_faces_indices_offset'], cellFaceIndexOffset)
  constructArray(blockData['Block_Geom:I'], i)
  constructArray(blockData['Block_Geom:J'], j)
  constructArray(blockData['Block_Geom:K'], k)
  constructArray(blockData['Block_Geom:faces_directions_per_cell'], faceDirectionPerCell)
  constructArray(blockData['Block_Geom:cell_zoneidx'], cellZoneIdx)
  constructArray(blockData['Block_Geom:typeiid_per_face'], faceTypeTypeIid)

  return {
    i,
    j,
    k,
    cellFaceNum,
    cellFaceIndex,
    cellFaceIndexOffset,
    faceVerticeNum,
    faceVerticeIndex,
    faceVerticeIndexOffset,
    vertice,
    faceDirectionPerCell,
    cellZoneIdx,
    faceTypeTypeIid
  }
}
