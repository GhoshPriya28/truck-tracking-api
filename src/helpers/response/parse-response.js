const { Managers, TruckParkingAddress } = require("../../sql-connections/models");
require('dotenv').config();


//transport response
const transporterResponseData = async function (responseData, token) {
    const findManagers = await Managers.findOne({
        where: { manager_id: responseData.manager_id, unique_role_id: responseData.unique_role_id }
    });

    const findParkAddresses = await TruckParkingAddress.findAll({
        where: { unique_role_id: responseData.unique_role_id }
    });

    const truckParkingAddressDetail = findParkAddresses.map((address) => ({
        truckParkId: address.truck_park_id || '',
        address: address.address || ''
    }));

    const responseTransporterData = {
        id: responseData.id || 0,
        transporterId: responseData.unique_role_id || '',
        role:responseData.role || '',
        name: responseData.name || '',
        tradeName: responseData.trade_name || '',
        email: responseData.email || '',
        countryCode: responseData.isd_code || '',
        contactNum: responseData.contact_num.toString() || '',
        physicalAddress: responseData.physical_address || '',
        postalCode: responseData.postal_code || '',
        country: responseData.country || '',
        companyRegNumber: responseData.com_reg_num || '',
        telephoneNumber: responseData.tel_number || '',
        contactPerson: responseData.contact_person || '',
        isDeleted: responseData.is_deleted === 1,
        isRegistered: !!responseData.contact_num,
        token:token,
        truckParkingAddressDetail: truckParkingAddressDetail,
        managerDetail: {
            managerId: findManagers?.manager_id || '',
            fullName: findManagers?.full_name || '',
            managerEmail: findManagers?.email || '',
            managerContactNumber: findManagers?.contact_num || '',
            managerCountryCode: findManagers?.isd_code || ''
        }
    };

    return responseTransporterData;
};

// broker response
const brokerResponseData = async function (responseData,token) {
    const responseBrokerData = {
        id: responseData.id || 0,
        brokerId: responseData.unique_role_id || '',
        role:responseData.role || '',
        name: responseData.name || '',
        tradeName: responseData.trade_name || '',
        email: responseData.email || '',
        countryCode: responseData.isd_code || '',
        contactNum: responseData.contact_num.toString() || '',
        physicalAddress: responseData.physical_address || '',
        postalCode: responseData.postal_code || '',
        country: responseData.country || '',
        companyRegNumber: responseData.com_reg_num || '',
        telephoneNumber: responseData.tel_number || '',
        contactPerson: responseData.contact_person || '',
        isDeleted: responseData.is_deleted === 1,
        isRegistered: !!responseData.contact_num,
        token:token,
    };

    return responseBrokerData;
};

// client response
const clientResponseData = async function (responseData,token) {
    const responseClientData = {
        id: responseData.id || 0,
        clientId: responseData.unique_role_id || '',
        role:responseData.role || '',
        name: responseData.name || '',
        tradeName: responseData.trade_name || '',
        countryCode: responseData.isd_code || '',
        contactNum: responseData.contact_num.toString() || '',
        physicalAddress: responseData.physical_address || '',
        postalCode: responseData.postal_code || '',
        country: responseData.country || '',
        companyRegNumber: responseData.com_reg_num || '',
        telephoneNumber: responseData.tel_number || '',
        contactPerson: responseData.contact_person || '',
        isDeleted: responseData.is_deleted === 1,
        isRegistered: !!responseData.contact_num,
        creditLimitApplication:responseData.credit_limit_application || '',
        transportAggrement:responseData.transport_aggrement || '',
        goodsTransitLimitPerTruck:responseData.goods_transit_limit_pertruck || '',
        rateAggrementForm:responseData.rate_aggrement_form || '',
        creditLimitPayTerms:responseData.credit_limit_pay_terms || '',
        token:token,
    };

    return responseClientData;
};

//get doc response data
const getFileResponseData = async function (responseData, documentType, expiryDate) {
    if (responseData && responseData.path) {
      const responseFileData = {
        documentType: documentType,
        path: process.env.BASE_URL + responseData.path.replace(/\\/g, '/'),
        filename: responseData.filename,
        expiryDate: expiryDate
      };
      return responseFileData;
    } else {
      throw new Error('Invalid response data');
    }
  };
  const getVehicleResponseData = async function (vehicle) {
    const responseVehicleData = {
      accountId: vehicle.account_id,
      driverName: vehicle.driver_name,
      contactNum: vehicle.contact_num,
      fileDetail: [
        {
          dlFilePath: vehicle.dl_file_path,
          dlNumber: vehicle.dl_num,
          dlExpiryDate: vehicle.dl_exp_date,
        },
        {
          dPassportFilePath: vehicle.d_passport_file_path,
          dPassportNum: vehicle.d_passport_num,
          dPassportExpiryDate: vehicle.d_passport_exp_date,
        },
        {
          truckFilePath: vehicle.truck_file_path,
          truckDetail: vehicle.truck_detail,
        },
        {
          trailer1FilePath: vehicle.trailer1_file,
          trailer1Detail: vehicle.trailer1_detail,
        },
        {
          trailer2FilePath: vehicle.trailer2_file,
          trailer2Detail: vehicle.trailer2_detail,
        },
      ],
    };
  
    return responseVehicleData;
  };
  
module.exports = {
    transporterResponseData,
    brokerResponseData,
    clientResponseData,
    getFileResponseData,
    getVehicleResponseData
    // getDocResponseDataForBroker
};